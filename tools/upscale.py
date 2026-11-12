"""Апскейлер фото для сайта: нейросеть Real-ESRGAN, работает без интернета.

Зачем: на старом сайте многие снимки около 1000 px — на весь экран они мылятся.
Нейросеть один раз увеличивает фото в 4 раза, дорисовывая резкие края, а сайт показывает готовый файл.
Посетителю ничего не нужно скачивать и ждать — апскейл делается здесь, при подготовке фото.

Установка (один раз):  pip install onnxruntime pillow numpy
Запуск:
  python tools/upscale.py ВХОД.jpg ВЫХОД.jpg                 — увеличить в 4 раза
  python tools/upscale.py ВХОД.jpg ВЫХОД.jpg --width 2400    — увеличить и привести к ширине 2400 px
  python tools/upscale.py --hero ИМЯ ВХОД.jpg                — сразу файлы для карусели:
                                                              img/hero/ИМЯ-2400.jpg и ИМЯ-1200.jpg
Опции: --model best|fast (по умолчанию best: RealESRGAN_x4plus, самая качественная, но медленная;
       fast: realesr-general-x4v3, раз в 10 быстрее, детали мягче),
       --denoise 0..1 (по умолчанию 0.5: чем больше, тем сильнее убирает шум и артефакты JPEG),
       --tile 256 (размер кусков; меньше — меньше памяти).

Модели: tools/models/realesrgan-x4plus.onnx (64 МБ, best) и tools/models/realesr-general-x4v3.onnx (4.6 МБ, fast),
Real-ESRGAN, лицензия BSD-3-Clause,
https://github.com/xinntao/Real-ESRGAN; ONNX-версия: huggingface.co/jonathanst29/tinier-upscale-models.
"""
import argparse, os, sys
import numpy as np
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = {'best': os.path.join(ROOT, 'tools', 'models', 'realesrgan-x4plus.onnx'),
          'fast': os.path.join(ROOT, 'tools', 'models', 'realesr-general-x4v3.onnx')}
SCALE = 4


def load_session(model='best'):
    import onnxruntime as ort
    path = MODELS[model]
    if not os.path.exists(path) and model == 'best':
        print('Нет модели best, беру fast'); path = MODELS['fast']
    if not os.path.exists(path):
        sys.exit(f'Нет файла модели: {path}')
    opts = ort.SessionOptions()
    opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    sess = ort.InferenceSession(path, opts, providers=ort.get_available_providers())
    shape = sess.get_inputs()[0].shape
    if len(shape) != 4 or shape[1] != 3:
        sys.exit(f'Модель {path} ждёт вход {shape}, а нужен [1, 3, h, w]')
    return sess


def run(sess, arr):
    """arr: float32 HxWx3 в [0,1] -> float32 (4H)x(4W)x3."""
    x = np.ascontiguousarray(arr.transpose(2, 0, 1)[None])
    y = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
    return np.clip(y.transpose(1, 2, 0), 0, 1)


def upscale(img, sess=None, tile=256, pad=16, denoise=0.5, model='best'):
    """Увеличивает PIL-картинку в 4 раза по кускам (без швов: куски с запасом, запас отрезается)."""
    sess = sess or load_session(model)
    src = np.asarray(img.convert('RGB'), dtype=np.float32) / 255.0
    # «denoise»: модель склонна усиливать артефакты сжатия; лёгкое сглаживание входа их гасит
    if denoise > 0:
        from PIL import ImageFilter
        soft = np.asarray(img.convert('RGB').filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32) / 255.0
        src = src * (1 - denoise * 0.6) + soft * (denoise * 0.6)
    h, w, _ = src.shape
    out = np.zeros((h * SCALE, w * SCALE, 3), dtype=np.float32)
    for y0 in range(0, h, tile):
        for x0 in range(0, w, tile):
            y1, x1 = min(y0 + tile, h), min(x0 + tile, w)
            ya, xa, yb, xb = max(0, y0 - pad), max(0, x0 - pad), min(h, y1 + pad), min(w, x1 + pad)
            r = run(sess, src[ya:yb, xa:xb])
            oy, ox = (y0 - ya) * SCALE, (x0 - xa) * SCALE
            out[y0 * SCALE:y1 * SCALE, x0 * SCALE:x1 * SCALE] = r[oy:oy + (y1 - y0) * SCALE, ox:ox + (x1 - x0) * SCALE]
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8))


def to_width(img, width):
    if img.width == width: return img
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)


def save(img, path, quality=86):
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    img.save(path, quality=quality, progressive=True, optimize=True)
    print(f'  {os.path.relpath(path, ROOT)}  {img.width}x{img.height}')


def main():
    ap = argparse.ArgumentParser(description='Апскейл фото нейросетью Real-ESRGAN')
    ap.add_argument('src'); ap.add_argument('dst', nargs='?')
    ap.add_argument('--width', type=int); ap.add_argument('--hero')
    ap.add_argument('--denoise', type=float, default=0.5); ap.add_argument('--tile', type=int, default=256)
    ap.add_argument('--model', choices=list(MODELS), default='best')
    a = ap.parse_args()
    img = ImageOps.exif_transpose(Image.open(a.src)).convert('RGB')
    print(f'{a.src}: {img.width}x{img.height} -> x4')
    big = upscale(img, tile=a.tile, denoise=a.denoise, model=a.model)
    if a.hero:
        portrait = big.height > big.width
        b = big.resize((round(big.width * 2000 / big.height), 2000), Image.LANCZOS) if portrait else to_width(big, min(2400, big.width))
        s = big.resize((round(big.width * 1100 / big.height), 1100), Image.LANCZOS) if portrait else to_width(big, 1200)
        save(b, os.path.join(ROOT, 'img', 'hero', f'{a.hero}-2400.jpg'))
        save(s, os.path.join(ROOT, 'img', 'hero', f'{a.hero}-1200.jpg'))
        print(f'В HERO_POOL: w:{b.width}, h:{b.height}, sw:{s.width}, q:{b.width}')
    else:
        save(to_width(big, a.width) if a.width else big, a.dst or os.path.splitext(a.src)[0] + '-x4.jpg')


if __name__ == '__main__':
    main()

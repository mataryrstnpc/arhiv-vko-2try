"""Английский перевод прейскуранта платных услуг (dev/customer-prices.json): машинный перевод, не вычитан носителем языка.
Порядок строк совпадает с русским оригиналом; build_customer_tr.py это проверяет."""

DOC = 'Price list for goods (works, services) sold by the state archives of the Department of Digitalisation and Archives of East Kazakhstan Region'

NOTES = {
    'vet': 'Participants in the Great Patriotic War receive a 50% discount on payment for work connected with the use of archival documents and on information services that are not of a socio-legal nature (except for genealogical requests).',
    'free': 'Thematic requests of the local executive body, state bodies, courts and prosecutor’s offices connected with the performance of their functions are fulfilled free of charge.',
    'fmt': 'The prices for photocopies and digital copies are given for A4 documents. For other formats the cost increases proportionally: A3 — twice, A2 — three times.',
    'rest': 'The prices for restoration and repair of documents depend on complexity and cover labour only; the cost of materials must be added to them.',
    'rules': 'Paid work and services are provided by state archives in accordance with the Rules for providing paid activities for the sale of goods (works, services) by state archives, the money from which remains at their disposal, and for spending the money received from the sale of goods (works, services).',
}

RESTOR = [
    'first complexity — documents with a severely damaged base that require selecting and mounting a sheet from separate fragments, joins along two to four sides of the sheet and internal joins, mounting on a new base or reinforcing the base of the document with restoration paper;',
    'second complexity — damaged documents that require a join along from 2/3 of one side of the sheet to a whole side and one internal join, and reinforcing the base of the document with restoration paper on one side;',
    'third complexity — damaged documents that require a join along up to 2/3 of a side of the sheet and reinforcing the base of the document with restoration paper over up to ½ of the sheet;',
    'fourth complexity — documents that require fixing the damaged edges of the sheet with strips of restoration paper up to 5 cm wide.',
]

SECS = [
    'Courses and seminars on modern principles of documentation and records management commissioned by legal entities, development of classifications of files and records management instructions',
    'Putting archival documents in order',
    'Restoration and repair of documents, making envelopes',
    'Depositary storage of archival documents',
    'Organising and holding documentary exhibitions commissioned (on request) by individuals and legal entities',
    'Finding genealogical and thematic information commissioned (on request) by individuals and legal entities',
    'Publishing and selling methodological literature, collections of archival documents, teaching aids and other publications',
    'Making copies of archival documents',
]

ROWS = [
    # 0: курсы, семинары, номенклатуры (10)
    [('Development of classifications of files', ''), ('Drawing up standard (model) classifications of files', 'item'), ('Drawing up specific classifications of files of organisations', 'item'),
     ('Drawing up guidance on the application of the classification of files', ''), ('Development of a records management instruction:', 'instruction'), ('regional level', 'instruction'),
     ('city or district level', 'instruction'), ('Holding courses and seminars commissioned (on request) by legal entities', ''),
     ('Holding a training seminar for records management staff and departmental (private) archives', '8 academic hours / 1 specialist'),
     ('Holding advanced training courses for records management staff and departmental (private) archives (with certificates)', '3 days / 1 specialist')],
    # 1: упорядочение (123)
    [('Putting documents and files in order', ''), ('Drawing up historical notes on the fonds of organisations for a period of:', ''), ('more than 10 years', 'sheet'), ('from 5 to 10 years', 'sheet'), ('up to 5 years', 'sheet'),
     ('Preparing a working instruction on putting the documents and files of an organisation in order:', ''), ('republican level', 'instruction'), ('regional level', 'instruction'), ('city or district level', 'instruction'),
     ('Drawing up a plan for putting the documents and files of an organisation in order:', ''), ('republican level', 'plan'), ('regional level', 'plan'), ('city or district level', 'plan'),
     ('Developing schemes for systematising the files of an organisation’s fonds:', ''), ('republican level', 'scheme'), ('regional level', 'scheme'), ('city or district level', 'scheme'),
     ('Determining and clarifying the fonds membership of documents and files', 'storage unit'),
     ('Systematising files before appraisal of the value of documents and files:', ''), ('by fonds', 'storage unit'), ('within fonds by years (or structural parts)', 'storage unit'), ('alphabetically', 'storage unit'),
     ('Appraisal of the scientific and practical value of administrative documentation:', ''), ('with a sheet-by-sheet review of the documents', 'storage unit'), ('without a sheet-by-sheet review of the documents', 'storage unit'),
     ('Appraisal of the scientific and practical value of scientific and technical documentation', ''), ('textual:', ''), ('with a sheet-by-sheet review of the documents', 'sheet'), ('without a sheet-by-sheet review of the documents', 'storage unit'), ('graphic', 'sheet'),
     ('Appraisal of the scientific and practical value of audiovisual documentation', ''), ('film documents and video recordings', 'hour of playing time'), ('photographic documents', 'accounting unit'), ('sound documents', 'hour of playing time'),
     ('Appraisal of creative documentation', 'storage unit'),
     ('Appraisal of the scientific and practical value of personnel records:', ''), ('with a sheet-by-sheet review of the documents', 'storage unit'), ('without a sheet-by-sheet review of the documents', 'storage unit'),
     ('Forming files from loose documents:', ''), ('administrative documentation', 'sheet'), ('personnel records', 'sheet'), ('creative documentation', 'sheet'),
     ('Re-forming files:', ''), ('administrative documentation', 'sheet'), ('creative documentation', 'sheet'), ('personnel records', 'sheet'),
     ('Systematising documents within files', 'sheet'),
     ('Systematising scientific and technical documentation by parts, project stages, stages of topics, etc.', ''), ('textual documentation', 'storage unit'), ('graphic documentation', 'storage unit'),
     ('Drawing up file headings:', ''), ('administrative documentation', 'heading'), ('scientific and technical documentation', 'heading'), ('creative documentation', 'heading'), ('personnel records and personal files', 'heading'),
     ('Drawing up internal inventories of documents in files:', ''), ('administrative and creative documentation', 'heading'), ('textual scientific and technical documentation', 'heading'), ('graphic scientific and technical documentation', 'heading'), ('in sets of personal files, medical histories and similar documents', 'heading'),
     ('Systematising cards for files with headings:', ''), ('by structural or subject-thematic (issue) features, by parts and project stages', 'card'), ('by nominal or chronological features or alphabetically', 'card'),
     ('Editing file headings:', ''), ('with administrative documentation', ''), ('with a partial review of the files', 'heading'), ('without a review of the files', 'heading'), ('with creative documentation', 'heading'), ('personal files', 'heading'),
     ('Putting archival codes on cards', 'card'),
     ('Folding drawings in files:', ''), ('format larger than A4', 'sheet'), ('format A1 and larger', 'sheet'),
     ('Binding files:', ''), ('standard', 'storage unit'), ('non-standard', 'storage unit'), ('personal files and files of up to 50 sheets', 'storage unit'),
     ('Placing files that cannot be bound in folders with flaps', 'storage unit'),
     ('Numbering sheets in files:', ''), ('personal files and files of up to 50 sheets', 'sheet'), ('files of more than 50 sheets', 'sheet'), ('sheets of non-standard format and quality', 'sheet'), ('graphic documentation', 'sheet'),
     ('Renumbering sheets in files', ''), ('files of up to 50 sheets', 'sheet'), ('files of more than 50 sheets', 'sheet'), ('sheets of non-standard format and quality', 'sheet'), ('graphic documentation', 'sheet'),
     ('Checking the numbering of sheets in files:', ''), ('files of up to 50 sheets', 'sheet'), ('files of more than 50 sheets', 'sheet'), ('sheets of non-standard format and quality', 'sheet'), ('graphic documentation', 'sheet'),
     ('Making up file covers or title sheets', ''), ('where there is a printed cover or title of the organisation', 'cover'), ('administrative and creative documentation', 'cover'), ('personal files', 'cover'),
     ('where there is no printed cover or title of the organisation', 'cover'), ('administrative and creative documentation', 'cover'), ('personal files', 'cover'),
     ('Putting archival codes on file covers:', ''), ('without stamps', 'storage unit'), ('with stamps', 'storage unit'),
     ('Drawing up inventories of files', 'heading'),
     ('Drawing up forewords to inventories of organisations’ fonds:', 'sheet'), ('more than 10 years', 'sheet'), ('from 5 to 10 years', 'sheet'), ('up to 5 years', 'sheet'),
     ('Drawing up lists of abbreviations for inventories', 'item'), ('Drawing up indexes to inventories', 'item'), ('Preparing inventories', 'inventory'),
     ('Drawing up an act on selecting documents and files for destruction', 'item'),
     ('Drawing up lists (acts, certificates) of missing documents and files of an organisation:', ''), ('republican level', '(list, act)'), ('regional level', '(list, act)'), ('city and district level', '(list, act)'),
     ('Drawing up an act on completion of putting documents and files in order', 'act'), ('Drawing up acts on returning documents to the owner', 'act'),
     ('Making labels for bundles', ''), ('Writing labels', 'label'), ('Sticking labels on boxes', 'label'),
     ('Forming bundles of files to be kept', 'storage unit'), ('Placing boxes or bundles on shelves', 'bundle')],
    # 2: реставрация (16)
    [('Repair of documents and printed publications with extension of spines and preparation for binding work*:', ''), ('complex', 'sheet'), ('minor', 'sheet'), ('newspapers', 'sheet'), ('books, magazines', 'sheet'),
     ('Restoration of documents*:', ''), ('first category of complexity', 'sheet'), ('second category of complexity', 'sheet'), ('third category of complexity', 'sheet'), ('fourth category of complexity', 'sheet'),
     ('Dust removal:', ''), ('dust removal from files', 'storage unit'), ('dust removal from boxes', 'box'),
     ('Making envelopes:', ''), ('non-standard envelopes, size up to 30×40 cm', 'envelope'), ('standard envelopes, size up to 30×40 cm', 'envelope')],
    # 3: депозитарное хранение (1)
    [('Depositary storage', 'storage unit / year')],
    # 4: выставки (11)
    [('Preparing a historical documentary exhibition (developing the concept, preparing the feasibility study, drawing up a room-by-room inventory, finding and scanning documents for the display and catalogue, etc.)', 'exhibition'),
     ('Finding documents for exhibitions, collections and reviews', 'document'), ('pre-Soviet period', ''), ('up to 25 exhibits;', 'exhibition / exhibit'), ('up to 50 exhibits;', 'exhibition / exhibit'), ('up to 100 exhibits.', 'exhibition / exhibit'),
     ('Soviet and post-Soviet period:', ''), ('up to 25 exhibits;', 'exhibition / exhibit'), ('up to 50 exhibits;', 'exhibition / exhibit'), ('up to 100 exhibits.', 'exhibition / exhibit'),
     ('Organising and holding documentary exhibitions based on documents commissioned (on request) by individuals and legal entities', 'exhibition')],
    # 5: генеалогия, запросы (20)
    [('Scientific consultation for a user on a topic of interest (history of the question, historical era or period, individuals, genealogical research, etc.)', '1 hour'),
     ('Fulfilling thematic and genealogical requests:', 'request'), ('reviewing files', 'file'),
     ('Finding information on the subject of a request in the finding aids:', ''), ('typewritten inventories', 'heading'), ('handwritten inventories', 'heading'), ('catalogues/card indexes', 'card'), ('automated information retrieval system (AIRS)', 'record (per search result)'),
     ('Finding information on the subject of a request in published sources, periodicals and reference literature', 'printed sheet (one side)'), ('in published sources', 'printed sheet (one side)'), ('in magazines', 'printed sheet (one side)'), ('in newspapers', 'printed sheet (one side)'),
     ('Finding information on the subject of a request in:', ''), ('documents of the 19th–21st centuries, legible handwritten text, one side', 'sheet (image)'), ('documents of the 19th–21st centuries, typewritten text, one side', 'sheet (image)'),
     ('documents with hard-to-read, fading handwritten or typewritten text, one side', 'sheet (image)'), ('creative documents with hard-to-read, fading handwritten text', 'sheet (image)'), ('cartographic documents (depending on format)', 'A4-format sheet'),
     ('Making additional copies of an archival certificate at the request of the applicant', 'copy'), ('Issuing a duplicate or reissuing an archival certificate', 'copy')],
    # 6: издания (12)
    [('Preparation of:', ''), ('scientific and popular-science collections of documents, archival finding aids (on various media), other documentary publications', 'sheet'), ('radio programmes', 'programme of up to 10 minutes'),
     ('television programmes', 'programme of up to 10 minutes'), ('based on documents of the Soviet period', 'programme of up to 10 minutes'), ('based on documents of the pre-Soviet period', 'programme of up to 10 minutes'),
     ('articles for the media', 'article of 0.3 printed sheets'), ('based on documents of the Soviet period', 'article of 0.3 printed sheets'), ('based on documents of the pre-Soviet period', 'article of 0.3 printed sheets'),
     ('Preparing a thematic selection of archival files and documents and providing them for film, video and photo shooting with the customer’s technical equipment:', 'selection'), ('based on documents of the Soviet period', 'selection'), ('based on documents of the pre-Soviet period', 'selection')],
    # 7: копии (25)
    [('Making copies (including to create an insurance fonds and a use fonds) of one-sided archival documents and one-sided printed publications with the archive’s technical means, taking into account the copying technology and format (depending on the physical condition and parameters of the medium of the object being copied)**:', ''),
     ('One-sided archival documents on paper and printed publications:', ''), ('photocopy (a copy made by photographic shooting):', 'A4 sheet'),
     ('- document before 1900', 'sheet'), ('- document of 1901–1917', 'sheet'), ('- document of 1918–1945', 'sheet'), ('- document of 1946–1990', 'sheet'), ('- document of 1991 to the present day', 'sheet'),
     ('- the same with fading text or on tissue paper, A4 format', 'sheet'), ('Making photocopies of A5 text documents', 'sheet'),
     ('Making a photocopy from tracing paper:', ''), ('A2 format', 'sheet'), ('A3 format', 'sheet'), ('A4 format', 'sheet'), ('A5 format', 'sheet'),
     ('Digital copy of a one-sided A4 document, JPEG and PDF file type in colour, with computer processing of the image, resolution 300 dpi (hard disk, DVD, excluding the cost of the medium)', ''),
     ('- document of the 19th century – 1930, A4 format', 'image'), ('- document of 1931 – 21st century, A4 format', 'image'),
     ('Copying digitised documents to the customer’s external storage device (A4 document, JPEG and PDF file type, resolution 300 dpi; video documents — MP3 and MPEG4 file type, 240–1080 pixels):', ''), ('- hard disk', 'min. (image)'), ('- DVD', 'min. (image)'),
     ('Making copies of archival documents by the user with their own contactless mobile copying device without tripods, detachable lenses or lighting equipment, with the flash function switched off (phone, camera, tablet), in the presence of an archive employee who ensures the preparation of the archival documents for copying, their safety during copying and control of compliance with the copying conditions', 'image, frame of a one-sided sheet'),
     ('- document of the 17th–18th centuries, A4 format', 'image, frame of a one-sided sheet'), ('- document of the 19th century – 1945, A4 format', 'image, frame of a one-sided sheet'), ('- document of 1946 – 21st century, A4 format', 'image, frame of a one-sided sheet')],
]

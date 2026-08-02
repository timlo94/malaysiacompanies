import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Cleaning up existing data...");
    await prisma.company.deleteMany({});
    
    // We define the top 100 names per category using pipe-delimited strings to keep code compact and fast.
    const rawData: Record<string, string> = {
        "Real Estate": "S P Setia Bhd|IOI Properties Group Bhd|Sime Darby Property Bhd|Sunway Bhd|Mah Sing Group Bhd|Eco World Development Group Bhd|UEM Sunrise Bhd|IGB Bhd|Matrix Concepts Holdings Bhd|UOA Development Bhd|LBS Bina Group Bhd|Tropicana Corporation Bhd|YTL Land & Development Bhd|Glomac Bhd|Paramount Corporation Bhd|KSL Holdings Bhd|Hua Yang Bhd|Tambun Indah Land Bhd|Eastern & Oriental Bhd|Crescendo Corporation Bhd|Plenitude Bhd|Selangor Properties Bhd|Titijaya Land Bhd|Land & General Bhd|Malton Bhd|KLCC Property Holdings Bhd|Pavilion REIT|Sunway REIT|IGB REIT|Axis REIT|CapitaLand Malaysia Trust|Hektar REIT|Al-`Aqar Healthcare REIT|KIP REIT|Sentral REIT|UOA REIT|AmanahRaya REIT|Tower REIT|Atrium REIT|AME Elite Consortium Bhd|Radium Development Bhd|SkyWorld Development Bhd|Avaland Bhd|WCT Holdings Bhd (Property)|YNH Property Bhd|Thriven Global Bhd|Encorp Bhd|Naza TTDI Sdn Bhd|MKH Bhd|I-Berhad|KUB Malaysia Bhd (Property)|Daiman Development Bhd|Mutiara Goodyear Development|Symphony Life Bhd|Berjaya Assets Bhd|Mulpha International Bhd|Tanco Holdings Bhd|Safiey Illias Property|GuocoLand Malaysia Bhd|Selangor Dredging Bhd|Amverton Bhd|BCB Bhd|Country Heights Holdings Bhd|D'nonce Technology|Ekovest Bhd (Property)|Eupe Corporation Bhd|Fasih Harapan|Global Oriental Bhd|Halex Holdings|Ibraco Bhd|Ideal United Bintang|Iskandar Waterfront City Bhd|Johore Tin (Property)|Ken Holdings Bhd|KSL Properties|L&G Properties|Magna Prima Bhd|Majuperak Holdings|MCT Bhd|Menang Corporation|Meridian Bhd|Metro Kajang Holdings|Minda Global|MRCB (Property)|Naim Holdings Bhd|O&C Resources|Osk Property Holdings|Pan Malaysia Corporation|Pegasus Heights|Perdana ParkCity|Plenitude|PRG Holdings|Rimbunan Sawit (Property)|Sanichi Technology|SBC Corporation|SHL Consolidated|SPK-Sentosa|Talam Transform Bhd|Trinity Group Sdn Bhd|Zecon Bhd",
        "Health Care": "IHH Healthcare Bhd|KPJ Healthcare Bhd|Top Glove Corporation Bhd|Hartalega Holdings Bhd|Kossan Rubber Industries Bhd|Supermax Corporation Bhd|Pharmaniaga Bhd|Duopharma Biotech Bhd|Apex Healthcare Bhd|Adventa Bhd|TMC Life Sciences Bhd|Optimax Holdings Bhd|Cengild Medical Bhd|Sunway Medical Centre|Assunta Hospital|Pantai Holdings|Gleneagles Malaysia|Columbia Asia Malaysia|Caring Pharmacy Group|Alpro Pharmacy|Big Pharmacy Healthcare|Riverstone Holdings|Comfort Gloves Bhd|Rubberex Corporation|Careplus Group Bhd|Hextar Healthcare Bhd|UMediC Group Bhd|DC Healthcare Holdings Bhd|LKL International Bhd|Bintai Kinden (Healthcare)|YSPSAH|Kotra Industries Bhd|Hovid Bhd|CCM Pharmaceuticals|Straits Inter Logistics|HSC Medical Center|Prince Court Medical Centre|Subang Jaya Medical Centre|Mahkota Medical Centre|Island Hospital Penang|Penang Adventist Hospital|Loh Guan Lye Specialists|Kedah Medical Centre|Sabah Medical Centre|Normah Medical Specialist|KPJ Ampang Puteri|KPJ Damansara|Avisena Specialist Hospital|Beacon Hospital|Thomson Hospital|Qualitas Health|Klinik Mediviron|Poliklinik Penawar|BP Healthcare Group|Pathlab Malaysia|Gribbles Pathology|InnoQuest Pathology|Health Lane Family Pharmacy|Multicare Pharmacy|AA Pharmacy|Watsons Malaysia (Health)|Guardian Malaysia (Health)|Nova Wellness Group|Bioalpha Holdings Bhd|Sunzen Biotech Bhd|OUD Asset|Esco Micro Malaysia|Idealite Wellness|Amlife International|Medi-Life|Nesh Publicare|Ogawa Malaysia|Gintell Malaysia|ResMed Malaysia|B. Braun Medical Malaysia|Dexcom Malaysia|Abbott Malaysia|Edwards Lifesciences|Ambu Malaysia|Ciba Vision Johor|Teleflex Medical Malaysia|Straits Orthopaedics|Vigilenz Medical Devices|ABio Orthopaedics|Allen Healthcare Products|Epsilon Medical Devices|Uro Technology|VIP Glove|WRP Asia Pacific|YTY Group|Sri Kota Specialist|Oriental Melaka Straits|Hospital Fatimah|ReGen Rehab Hospital|Daehan Rehabilitation|Tun Hussein Onn Eye Hospital|VISTA Eye Specialist|ISEC Healthcare|Beverly Wilshire Medical|Ko Skin Specialist",
        "Information Technology": "Inari Amertron Bhd|Malaysian Pacific Industries Bhd|Unisem (M) Bhd|ViTrox Corporation Bhd|MyEG Services Bhd|D&O Green Technologies Bhd|Frontken Corporation Bhd|Greatech Technology Bhd|Pentamaster Corporation Bhd|CTOS Digital Bhd|Revenue Group Bhd|UWC Bhd|Kobay Technology Bhd|Globetronics Technology Bhd|JHM Consolidation Bhd|QES Group Bhd|Mi Technovation Bhd|Oppstar Bhd|Aemulus Holdings Bhd|Elsoft Research Bhd|Datasonic Group Bhd|Microlink Solutions Bhd|Scicom (MSC) Bhd|Dagang NeXchange Bhd|Cuscapi Bhd|Iris Corporation Bhd|Excel Force MSC Bhd|GHL Systems Bhd|Securemetric Bhd|Infomina Bhd|ITMAX System Bhd|LGMS Bhd|SFP Tech Holdings Bhd|Agmo Holdings Bhd|Ecoscience International|Niche Tech Group|Kronologi Asia Bhd|OCK Group Bhd (Tech)|Edaran Bhd|Theta Edge Bhd|VSTECS Bhd|K-One Technology Bhd|VisDynamics Holdings Bhd|MMS Ventures Bhd|JF Technology Bhd|FoundPac Group Bhd|SLP Resources (Tech)|PIE Industrial Bhd|Notion VTec Bhd|KESM Industries Bhd|SilTerra Malaysia|SkyeChip|Aerodyne Group|Carsome|Catcha Digital Bhd|Rev Asia|iProperty Malaysia|PropertyGuru Malaysia|JobStreet Malaysia|Exabytes Network|Shinjiru Technology|ServerFreak|AwanBiru Technology|Heitech Padu Bhd|Prestariang|Willowglen MSC Bhd|Grand-Flo Bhd|ManagePay Systems Bhd|N2N Connect Bhd|Pantech Group (Tech)|RGB International Bhd|Sedania Innovator Bhd|SMTrack Bhd|Systech Bhd|Techna-X Bhd|YGL Convergence Bhd|Omesti Bhd|Formis Resources|Kelington Group Bhd|AppAsia Bhd|Asia Media Group|Binasat Communications|Censof Holdings Bhd|Dataprep Holdings Bhd|Diversified Gateway|E-Force|FSBM Holdings|GHLSYS|IFCA MSC Bhd|Inix Technologies|Key Asic Bhd|Luster Industries|M-Mode Bhd|NetX Holdings Bhd|Nova MSC Bhd|OpenSys (M) Bhd|Palette Multimedia|Rexit Bhd|Soft Space Sdn Bhd|JurisTech",
        "Financials": "Malayan Banking Bhd (Maybank)|Public Bank Bhd|CIMB Group Holdings Bhd|RHB Bank Bhd|Hong Leong Bank Bhd|AmBank Group|Affin Bank Bhd|Alliance Bank Malaysia Bhd|Bank Islam Malaysia Bhd|Bank Muamalat Malaysia Bhd|MBSB Bank Bhd|Kenanga Investment Bank Bhd|TA Enterprise Bhd|OSK Holdings Bhd|Bursa Malaysia Bhd|Allianz Malaysia Bhd|LPI Capital Bhd|Syarikat Takaful Malaysia|Tune Protect Group Bhd|Manulife Holdings Bhd|Zurich General Insurance|RCE Capital Bhd|Aeon Credit Service (M) Bhd|MIDF|Cagamas Bhd|Danajamin Nasional Bhd|Permodalan Nasional Bhd (PNB)|Khazanah Nasional Bhd|Employees Provident Fund (EPF)|Kumpulan Wang Persaraan (KWAP)|Lembaga Tabung Haji|Bank Rakyat|Agrobank|SME Bank Malaysia|EXIM Bank Malaysia|Bank Simpanan Nasional (BSN)|Maybank Islamic Bhd|CIMB Islamic Bank|Public Islamic Bank|RHB Islamic Bank|Hong Leong Islamic Bank|AmBank Islamic|Standard Chartered Malaysia|HSBC Bank Malaysia|OCBC Bank (Malaysia)|UOB Malaysia|Citibank Bhd|Al Rajhi Bank Malaysia|Kuwait Finance House|AIA Bhd|Great Eastern Life Assurance|Prudential Assurance|Etiqa General Insurance|FWD Takaful|Hong Leong Assurance|Tokio Marine Insurans|MSIG Insurance Malaysia|Berjaya Sompo Insurance|AmGeneral Insurance|Liberty Insurance Malaysia|AXA Affin General Insurance|Generali Malaysia|MCIS Insurance|Sun Life Malaysia|Kenanga Investors|Public Mutual|Principal Asset Management|AHAM Capital (Affin Hwang)|Areca Capital|Opus Asset Management|UOB Asset Management|KAF Investment Bank|HwangDBS|MIDF Amanah Investment|Hong Leong Capital|Apex Equity Holdings Bhd|Johan Holdings Bhd|Pan Malaysia Capital|ECM Libra Group Bhd|Insas Bhd|MNRB Holdings Bhd|Pacific & Orient Bhd|MAA Group Bhd|TNG Digital (Touch 'n Go)|Boost Holdings|BigPay|GXBank|AEON Bank|Boost Bank|Creador|Navis Capital Partners|Ekuiti Nasional Bhd (Ekuinas)|MAVCAP|MDV (Malaysia Debt Ventures)|MTDC|Credit Guarantee Corp|PIDM|BP Plastics (Financial)|CapBay|Funding Societies Malaysia",
        "Utilities": "Tenaga Nasional Bhd (TNB)|YTL Power International Bhd|Malakoff Corporation Bhd|Petronas Gas Bhd|Gas Malaysia Bhd|Mega First Corporation Bhd|Ranhill Utilities Bhd|Taliworks Corporation Bhd|PBA Holdings Bhd|Salcon Bhd|Solarvest Holdings Bhd|Samaiden Group Bhd|Sunview Group Bhd|Cypark Resources Bhd|Pekat Group Bhd|Ekovest Bhd (Utilities)|Kumpulan Perangsang Selangor|Eden Inc Bhd|Sarawak Energy Bhd|Sabah Electricity Sdn Bhd|Pengurusan Aset Air Bhd|Air Selangor|SADA (Kedah)|Syarikat Air Melaka|Ranhill SAJ|SATU (Terengganu)|Laku Management (Sarawak)|Jati Tinggi Group Bhd|Minetech Resources Bhd (RE)|Reneuco Bhd|Edra Power Holdings|TNB Power Generation|TNB Renewables|Jimah Energy Ventures|Tanjung Bin Power|Segari Energy Ventures|Prai Power|GB3 Sdn Bhd|Panglima Power|Pahlawan Power|Ranhill Powertron|Ranhill Powertron II|Kimanis Power|Sabah Energy Corporation|Gentari Sdn Bhd|Plus Solar Systems|ERS Energy|Gading Kencana|Cenergi SEA|Concord Renewable Energy|Ditrolic Solar|Mattan Engineering|Leader Energy Group|Jentayu Sustainables Bhd|Bintai Kinden (Energy)|Pestech International Bhd|Sarawak Petchem (Utilities)|Bintulu Water|Kuching Water Board|Sibu Water Board|Northern Utility Resources|Nur Power|Central Electricity Supply|Tekala Corporation (Energy)|Taliworks (Langkawi)|Sungai Harmoni|Titisan Modal|Konsortium Abass|SPLASH|Puncak Niaga Holdings Bhd|George Kent (Water meters)|Engtex Group Bhd|YLI Holdings Bhd|Fitters Diversified Bhd|Kejuruteraan Asastera Bhd|GHL Energy|Vsolar Group Bhd|EITA Resources Bhd|MN Holdings Bhd|HE Group Bhd|UZMA (Renewable)|OCK Group (Solar)|Itmax (Smart grid)|AWC Bhd|HSS Engineers (Water)|SMHB Sdn Bhd|Tanco (Renewable)|E&O (Utility)|IJM (Water treatment)|Gamuda Water|KUB (Power)|MMC Corporation (Utilities)|Aliran Ihsan Resources|Bio Osmo|Darulaman Water|Globaltec Formation|KPS Consortium (Water)|Nylex (Utilities)|PRG (Energy)|Trive Property|Sabah Shell Petroleum|Sarawak Shell",
        "Energy": "Dialog Group Bhd|Yinson Holdings Bhd|Bumi Armada Bhd|Hibiscus Petroleum Bhd|Velesto Energy Bhd|Dayang Enterprise Holdings Bhd|Uzma Bhd|Wah Seong Corporation Bhd|Coastal Contracts Bhd|Carimin Petroleum Bhd|Deleum Bhd|T7 Global Bhd|Petra Energy Bhd|Barakah Offshore Petroleum Bhd|MMHE|Icon Offshore Bhd|Handal Energy Bhd|Alam Maritim Resources Bhd|Perdana Petroleum Bhd|Reach Energy Bhd|KNM Group Bhd|TH Heavy Engineering Bhd|Serba Dinamik Holdings Bhd|Petronas Carigali|Petronas Dagangan Bhd|Hengyuan Refining Company Bhd|Petron Malaysia Refining|Sapura Energy Bhd|WASCO Bhd|Pantech Group Holdings Bhd|Scomi Energy Services Bhd|Keyfield International Bhd|Reservoir Link Energy Bhd|Hextar Global (O&G)|Straits Energy Resources Bhd|MUDAJAYA Group (Energy)|Boustead Heavy Industries|Destini Bhd|Naim Holdings (O&G)|Bintulu Port Holdings (LNG)|EA Technique (M) Bhd|E.A.T|Ocean Vantage Holdings Bhd|Steel Hawk Bhd|BZME|Emas Offshore|Tanjung Offshore|UMW Oil & Gas|M3nergy|Scomi Marine|Lundin Malaysia|Roc Oil Malaysia|MDC Oil & Gas|FPSO Ventures|Pexco Sarawak|EQ Petroleum|Pearl Energy|Nido Petroleum|JX Nippon Oil & Gas|Hess Malaysia|Murphy Oil Malaysia|Repsol Malaysia|Shell Malaysia|ExxonMobil Malaysia|Chevron Malaysia|ConocoPhillips Malaysia|PTTEP Malaysia|Mubadala Energy Malaysia|TotalEnergies Malaysia|Schlumberger Malaysia|Halliburton Malaysia|Baker Hughes Malaysia|Weatherford Malaysia|TechnipFMC Malaysia|Aker Solutions Malaysia|McDermott Malaysia|Saipem Malaysia|Subsea 7 Malaysia|Cameron (Malaysia)|FMC Technologies|PBJV Group|Coral Alliance|Orogenic Resources|Altus Oil & Gas Malaysia|Asian Geos|Romstar Group|T7 Wenmax|Sribima Maritime|Dinamikjaya Motors (Energy)|MSET Engineering|Ranhill Worley|RNZ Integrated|MMC Oil & Gas|KKB Engineering (O&G)|Muhibbah Engineering (O&G)|Eversendai (O&G)|Tiong Woon (O&G)|Lanco|Sabah Shell|Sarawak Shell",
        "Consumer Staples": "Nestle (Malaysia) Bhd|QL Resources Bhd|PPB Group Bhd|Fraser & Neave Holdings Bhd|Carlsberg Brewery Malaysia|Heineken Malaysia Bhd|Dutch Lady Milk Industries|Ajinomoto (Malaysia) Bhd|Apollo Food Holdings Bhd|Kawan Food Bhd|Farm Fresh Bhd|Kian Joo Can Factory|CCK Consolidated Holdings|Teo Seng Capital Bhd|Lay Hong Bhd|Leong Hup International Bhd|QSR Brands (M) Holdings|Berjaya Food Bhd|Mr D.I.Y. Group (M) Bhd|99 Speed Mart Sdn Bhd|Aeon Co. (M) Bhd|Padini Holdings Bhd|Mydin Mohamed Holdings|Giant Malaysia|Lotus's Stores Malaysia|Village Grocer|Jaya Grocer|Hup Seng Industries Bhd|Oriental Food Industries Bhd|Power Root Bhd|Spritzer Bhd|Bina Darulaman (Agri)|Guan Chong Bhd|United Plantations Bhd|Kuala Lumpur Kepong Bhd|IOI Corporation Bhd|Batu Kawan Bhd|Sarawak Oil Palms Bhd|Tradewinds Plantation|FGV Holdings Bhd|Sime Darby Plantation Bhd|Genting Plantations Bhd|IJM Plantations|TH Plantations Bhd|Boustead Plantations Bhd|TSH Resources Bhd|Hap Seng Plantations|Ta Ann Holdings (Agri)|Jaya Tiasa (Agri)|BLD Plantation Bhd|Kim Loong Resources Bhd|Rimbunan Sawit Bhd|Cepatwawasan Group Bhd|MHC Plantations Bhd|Far East Holdings Bhd|Matang Bhd|Malayan Flour Mills Bhd|Lotte Chemical Titan (Packaging)|Rex Industry Bhd|Rhone Ma Holdings|Yenher Holdings Bhd|CAB Cakaran Corporation Bhd|PWF Corporation Bhd|LTKM Bhd|TPC Plus Bhd|Sinmah Capital Bhd|KFC Holdings Malaysia|Pizza Hut Malaysia|McDonald's Malaysia|OldTown White Coffee|Secret Recipe|PappaRich|Sushi King|Tealive|Chatime Malaysia|Baskin Robbins Malaysia|FamilyMart Malaysia|7-Eleven Malaysia Holdings|MyNews Holdings Bhd|KK Super Mart|Econsave Cash & Carry|TF Value-Mart|The Store Corporation|Bataras|Servay Hypermarket|Everrise|H&L Supermarket|Farley|LuLu Hypermarket Malaysia|Mamee-Double Decker|Munchy's|Julie's Biscuits|Ikano Handel (IKEA)|Macfood Services|Kerry Ingredients Malaysia|Cargill Malaysia|Bunge Malaysia|Wilmar International (Malaysia)|Mewah Group|Yee Lee Corporation",
        "Materials": "Petronas Chemicals Group Bhd|Press Metal Aluminium Bhd|Lotte Chemical Titan|Scientex Bhd|Thong Guan Industries Bhd|BP Plastics Holding Bhd|Cahya Mata Sarawak Bhd|Hume Cement Industries Bhd|Ann Joo Resources Bhd|Malaysia Smelting Corporation|Hextar Global Bhd|Samchem Holdings Bhd|Evergreen Fibreboard Bhd|HeveaBoard Bhd|Lii Hen Industries Bhd|Poh Huat Resources|Muda Holdings Bhd|Tomypak Holdings Bhd|Daibochi Bhd|SLP Resources Bhd|SKP Resources Bhd|V.S. Industry Bhd|ATA IMS Bhd|YP Macao|Ancom Nylex Bhd|Batu Kawan (Chemicals)|CCM Chemicals|Halex Holdings (Materials)|Hextar Industries Bhd|Imaspro Corporation|Sersol Bhd|Tex Cycle Technology|Hexza Corporation Bhd|Luxchem Corporation Bhd|Nylex (Malaysia) Bhd|Perstima|CSC Steel Holdings Bhd|Southern Steel Bhd|Kinsteel Bhd|Lion Industries Corporation|Melewar Industrial Group|Mycron Steel Bhd|Prestar Resources Bhd|Choo Bee Metal Industries|Masteel|Leon Fuat Bhd|A-Rank Bhd|Alcom Group Bhd|PMB Technology Bhd|LB Aluminium Bhd|P.A. Resources Bhd|KKB Engineering (Materials)|YKGI Holdings Bhd|UAC Bhd|Tasek Corporation Bhd|Malayan Cement Bhd|Lafarge Malaysia|Perak Transit (Materials)|MCement|SCIB|Kimlun Corporation (Manufacturing)|IJM Corporation (Materials)|Sunway (Building Materials)|Bina Plastic Industries|WEIDA (M) Bhd|Resintech Bhd|TSH Resources (Wood)|WTK Holdings Bhd|Subur Tiasa Holdings Bhd|Minho (M) Bhd|Focus Lumber Bhd|Mieco Chipboard Bhd|BSL Corporation|CB Industrial Product|Chin Well Holdings|Dominant Enterprise|Ekowood International|Euro Holdings|FACB Industries|Federal International|Fibon Bhd|Gadang Holdings (Materials)|Golden Pharos|Goodway Integrated|HIL Industries|Homeritz Corporation|Ipmuda Bhd|JMR Conglomeration|Karyon Industries|Keck Seng (Materials)|Kian Joo (Packaging)|KNM (Metals)|Kossan (Materials)|KPS Consortium (Paper)|Kyowa|LCTitan|Lhoist Malaysia|Oji Paper Malaysia|Nippon Paint Malaysia",
        "Communication Services": "Telekom Malaysia Bhd (TM)|CelcomDigi Bhd|Maxis Bhd|Time dotCom Bhd|Axiata Group Bhd|Astro Malaysia Holdings Bhd|Media Prima Bhd|Star Media Group Bhd|REDtone Digital Bhd|OCK Group Bhd|Binasat Communications Bhd|XOX Bhd|Tune Talk Sdn Bhd|YTL Communications (Yes)|U Mobile Sdn Bhd|Allo Technology Sdn Bhd|Edotco Group Sdn Bhd|Bernama|Sin Chew Media Corporation|Nanyang Press Holdings|The Edge Media Group|BFM Media|Measat Global Bhd|Telekom Sales & Services|Fiberail Sdn Bhd|Omesti Bhd (Telco)|OMESTI|redONE Network Sdn Bhd|Yoodo|Altel Communications|Merchantrade Asia|ViewQwest Malaysia|MyRepublic Malaysia|AIMS Data Centre|NTT MSC Sdn Bhd|VADS Bhd|Webe Digital Sdn Bhd|Sacofa Sdn Bhd|Fibercomm Network|Symphonet|Macro Lynx|PRASARANA (Comm services)|Media Chinese International|Utusan Melayu (M) Bhd|Kumpulan Karangkraf|Rev Media Group|Catcha Group|Malaysiakini|Free Malaysia Today|Malay Mail|The Malaysian Reserve|Sinar Harian|Suara Rakyat|Oriental Daily News|Guang Ming Daily|China Press|Tamil Nesan|Makkal Osai|Radio Televisyen Malaysia (RTM)|Awesome TV|SUKE TV|Gila-Gila|Les' Copaque Production|Animonsta Studios|WAU Animation|Lemon Sky Studios|Passion Republic|Streamline Studios Malaysia|Dentsu Malaysia|Ogilvy Malaysia|Leo Burnett Malaysia|TBWA Malaysia|McCann Erickson Malaysia|Mindshare Malaysia|IPG Mediabrands Malaysia|Havas Malaysia|Publicis Groupe Malaysia|FCB SHOUT Malaysia|Naga DDB Tribal|VMLY&R Malaysia|M&C Saatchi Malaysia|Grey Group Malaysia|Big Tree Outdoor|Seni Jaya Corporation Bhd|Redberry Ambient|JCDecaux Malaysia|Moving Walls|Nuffnang Malaysia|Innity Corporation Bhd|ADA|Macrokiosk Bhd|Silverlake Axis|RTM (Radio)|Astro Radio|Media Prima Audio|Star Media Radio|Onetel Communications|Electcoms|Asiaspace|Puncak Semangat",
        "Industrials": "Gamuda Bhd|IJM Corporation Bhd|Sunway Construction Group|WCT Holdings Bhd|Westports Holdings Bhd|Malaysia Airports Holdings|MISC Bhd|MMC Corporation Bhd|Pos Malaysia Bhd|Tasco Bhd|GD Express Carrier (GDEX)|Xin Hwa Holdings Bhd|CJ Century Logistics|Freight Management Holdings|Bintulu Port Holdings Bhd|Suria Capital Holdings Bhd|KKB Engineering Bhd|Muhibbah Engineering Bhd|Kimlun Corporation Bhd|Kerjaya Prospek Group Bhd|Econpile Holdings Bhd|HSS Engineers Bhd|UEM Edgenta Bhd|Tiong Nam Logistics|Swift Haulage Bhd|MRCB|Ekovest Bhd|Gadang Holdings Bhd|Mudajaya Group Bhd|Bina Darulaman Bhd|TRC Synergy Bhd|VIZIONE Holdings Bhd|Pesona Metro Holdings Bhd|Pintaras Jaya Bhd|MTD Capital Bhd|Zecon Bhd|Fajarbaru Builder Group Bhd|Crest Builder Holdings Bhd|George Kent (Malaysia) Bhd|HSL (Hock Seng Lee)|Cahya Mata Sarawak (Construction)|Ahmad Zaki Resources Bhd|Advancecon Holdings Bhd|Jaks Resources Bhd|Naim Holdings (Construction)|Protasco Bhd|WZ Satu Bhd|Ireka Corporation Bhd|Lebar Daun Bhd|KUB Malaysia Bhd (Industry)|UMW Holdings Bhd (Machinery)|Sime Darby Bhd (Industrial)|UMW Toyota Motor (Equipment)|Volvo Trucks Malaysia|Scania Malaysia|TC Euro Cars|Isuzu Malaysia|Hino Motors Malaysia|MBM Resources Bhd|BAuto (Bermaz Auto)|Tan Chong Motor Holdings Bhd|APM Automotive Holdings Bhd|Pecca Group Bhd|EP Manufacturing Bhd|Delloyd Ventures|MCE Holdings Bhd|Scomi Group Bhd|Prasarana Malaysia Bhd|KTM Bhd|Express Rail Link (ERL)|MRT Corp|Syarikat Prasarana Negara|Penang Port Sdn Bhd|Johor Port Bhd|Port of Tanjung Pelepas|Northport (Malaysia) Bhd|Kuantan Port Consortium|Sabah Ports|Kuching Port Authority|MAB Kargo|Malaysia Airlines Bhd|AirAsia|AirAsia X Bhd|Batik Air Malaysia|MYAirline|Firefly|Raya Airways|Transmile Group|Nationwide Express|J&T Express Malaysia|Ninja Van Malaysia|Lalamove Malaysia|DHL Express Malaysia|FedEx Express Malaysia|UPS Malaysia|Linfox Malaysia|KGW Group Bhd|AGX Group Bhd|Hextar Technologies|K-Konsult"
    };

    let globalRank = 1;
    const db: any[] = [];

    // Sector multipliers for realistic variance and size
    // Base is the max market cap for the top company in that sector (in Millions MYR)
    const m: Record<string, { base: number, cap: number, rev: number, margin: number, emp: number }> = {
        "Financials": { base: 120000, cap: 1.0, rev: 0.5, margin: 0.25, emp: 1.5 },
        "Utilities": { base: 70000, cap: 1.0, rev: 0.6, margin: 0.15, emp: 1.2 },
        "Information Technology": { base: 15000, cap: 1.0, rev: 0.9, margin: 0.25, emp: 3.5 },
        "Consumer Staples": { base: 35000, cap: 1.0, rev: 1.2, margin: 0.10, emp: 0.5 },
        "Energy": { base: 25000, cap: 1.0, rev: 1.4, margin: 0.12, emp: 0.8 },
        "Materials": { base: 45000, cap: 1.0, rev: 1.1, margin: 0.09, emp: 0.6 },
        "Communication Services": { base: 45000, cap: 1.0, rev: 0.8, margin: 0.18, emp: 2.0 },
        "Industrials": { base: 20000, cap: 1.0, rev: 0.9, margin: 0.07, emp: 0.4 },
        "Real Estate": { base: 15000, cap: 1.0, rev: 0.4, margin: 0.20, emp: 1.0 },
        "Health Care": { base: 55000, cap: 1.0, rev: 0.6, margin: 0.16, emp: 0.9 }
    };

    // Seeded PRNG for consistent data generation based on string
    const seededRandom = (str: string) => {
        let h = 0;
        for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
        const x = Math.sin(h) * 10000;
        return x - Math.floor(x);
    };

    // Interleave sectors so the overall Top 10 isn't just one sector
    for (let i = 0; i < 100; i++) {
        for (const sector in rawData) {
            const names = rawData[sector].split('|');
            if (names[i]) {
                const name = names[i];
                const sectorRank = i + 1;
                const mults = m[sector];
                
                // Base Market Cap: Top companies get massive caps (e.g. Maybank ~118B), decaying quickly
                let baseCap = mults.base; 
                if (sectorRank > 1) {
                    baseCap = mults.base / Math.pow(sectorRank, 0.85); 
                }

                const rand = seededRandom(name);
                
                // Calculated metrics
                const cap = Math.max(10, Math.round((baseCap * mults.cap) * (0.8 + rand * 0.4))); 
                const rev = Math.max(5, Math.round(cap * mults.rev * (0.7 + rand * 0.6)));
                const prof = Math.max(1, Math.round(rev * mults.margin * (0.7 + rand * 0.6)));
                
                // Employees: Assumption 1 employee per X revenue depending on sector
                const empBase = (rev * 1000000) / (800000 * mults.emp);
                const emp = Math.max(15, Math.round(empBase * (0.6 + rand * 0.8)));

                db.push({
                    rank: 0, // Will sort and assign later
                    company: name,
                    sector: sector,
                    marketCap: cap,
                    revenue: rev,
                    profit: prof,
                    employees: emp
                });
            }
        }
    }

    // Sort by Market Cap to determine the true overall Top 1000 rank
    db.sort((a, b) => b.marketCap - a.marketCap);
    
    // Batch insert
    let batch = [];
    for (let i = 0; i < db.length; i++) {
        const row = db[i];
        batch.push({
            rank: i + 1,
            company: row.company,
            sector: row.sector,
            marketCap: row.marketCap,
            revenue: row.revenue,
            profit: row.profit,
            employees: row.employees,
        });

        if (batch.length === 100 || i === db.length - 1) {
            console.log(`Seeding batch of ${batch.length} companies...`);
            await prisma.company.createMany({ data: batch });
            batch = [];
        }
    }
    
    console.log(`Successfully seeded ${db.length} companies.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

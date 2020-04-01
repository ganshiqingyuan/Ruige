-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: localhost    Database: ruige
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ruige`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ruige` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ruige`;

--
-- Table structure for table `product_list`
--

DROP TABLE IF EXISTS `product_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product_list` (
  `id` char(50) DEFAULT NULL,
  `typeID` char(50) DEFAULT NULL,
  `imgSrc` varchar(255) DEFAULT NULL,
  `descript` text NOT NULL,
  `updateTime` varchar(20) NOT NULL,
  `detail` text,
  `list_name` varchar(100) NOT NULL,
  `recommend` int(10) NOT NULL DEFAULT '0',
  `seo_con` text,
  `has_spec` int(2) DEFAULT NULL,
  `stock` int(10) DEFAULT NULL COMMENT '没有规格时的库存',
  `price` decimal(10,0) DEFAULT NULL COMMENT '没有规格时的价格',
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_list`
--

LOCK TABLES `product_list` WRITE;
/*!40000 ALTER TABLE `product_list` DISABLE KEYS */;
INSERT INTO `product_list` VALUES ('843ab115-0b7e-4fa3-93cf-b0d39aae340c','1bcc4e91-b831-44b6-8b5e-654a179c9c3d','https://ruigedist.oss-cn-hongkong.aliyuncs.com/FIRSTtwo.jpg','Best selling Digital Radiography in local market, cost-effective product.','1584862995153',' 22kw /200mA High frequency high voltage generator., Touch screen to set parameter., X ray table is possible to move left and right, tube column is fixed., Easy installation, small occupation space,Excellent image quality，wide clinical application. , 17*17 Flat panel detector., Size: 1400mm(L)*900mm(W)*2050mm(H), OEM/ODM x ray table is available. ','KPET-DR4500J',0,'null',0,12,120000),('2ec947c9-25e5-492b-9f08-ffb8c91b274b','1bcc4e91-b831-44b6-8b5e-654a179c9c3d','https://ruigedist.oss-cn-hongkong.aliyuncs.com/FIRSTthree.jpg','Global unique design, the most popular Digital Radiography.','1584862985816','22kw /200mA High frequency high voltage generator.,Touch screen to set parameter.,X ray table is possible to move four directions, tube column is fixed., Easy installation, small occupation space, Excellent image quality，wide clinical application. , 17*17 Flat panel detector.,Size: 1440mm(L)*1200mm(W)*2160mm(H),OEM/ODM x ray table is available. ','KPET-DR5500J',0,'null',0,12,10000),('6f4c9a6c-2529-4280-8cd3-934812b72d30','77e6332b-678b-4be1-8165-10c105e619c0','https://ruigedist.oss-cn-hongkong.aliyuncs.com/fourth12.png','3-part 23 parameters hematology analyzer','1577980552657','Working Principle: Impedance technology,  cyanmethemoglobin determination method and the SFT method without cyanide,Test Parameter: three part of white blood cell, 23 parameters(including WBC、RBC、PLT color histogram）,Standard dosage: 9.6μl（whole blood mode）20μl（Predilution mode）,Test speed: ≥30 samples/h, possible to work 24 hours with automatic dormancy and wake function,Result storage:All parameters of 50000 samples stored automatically including histogram、historical data,Operating language: Chinese','Hematology analyzer',1,NULL,0,NULL,NULL),('ff3be3e9-b614-470f-95b2-a9d039157b37','77e6332b-678b-4be1-8165-10c105e619c0','https://ruigedist.oss-cn-hongkong.aliyuncs.com/FOURone.jpg','New fast Immunity measurement system, easy and visual to operate.','1577980552657',' Testing principle：Nano amino microspheres immune transmission and scatter turbidimetric system，high sensitivity, wide detection range., Testing mode：Automatic test begin as soon as cup was placed into inspection hole.,Testing operation：Touch screen operation，automatic blending，automatic interpretation of blank and cauculate result.,Sample type：whole blood，serum，plasma，urine etc, The sample dilution multiple can be input and result can be conversed automatically.,Project selection：non-contact RF reagent card, card only need to be read once with same project.,HCT calibration，each whole blood sample ‘HCT can be calibrated automatically，accord with serum. , Result output：display on same screen, can be printed on computer.','Protein analysis system HD-101',1,NULL,0,NULL,NULL),('dc42b51a-3063-4f8e-a583-a9021f483c6d','2d4e1e10-c221-4dbd-b454-cf0cb8be1d96','https://ruigedist.oss-cn-hongkong.aliyuncs.com/TWICEone.jpg','Movable operation table, the highest cost-effective product.','1577980552658','Applicable for continuously work，high precision parameter control., Images can be acquired dynamically and statically during Operation., Generator，tube，I.I，collimator，multi-function photography bed，workstation，display unit，control unit etc. ,380V， 50kw, 630ma and 220V，22kw, 200ma., Operation table possible to move.','OTF 5000',1,NULL,0,NULL,NULL),('8e03c6c0-a25a-4d21-bdce-29a4f30c79e2','1bcc4e91-b831-44b6-8b5e-654a179c9c3d','https://ruigedist.oss-cn-hongkong.aliyuncs.com/FIRSTfour.jpg','High level product. bring different operation experience, and improve hospital level. ','1584862977208',' 22kw /200mA High frequency high voltage generator., Touch screen to set parameter.,X ray table is possible to move four directions., Tube is electrically controlled to go up and down., Easy installation, small occupation space, Excellent image quality，wide clinical application.,17*17 Flat panel detector., Size: 1440mm(L)*1150mm(W)*2050mm(H), OEM/ODM x ray table is available. ','KPET-DR6000J',0,'null',0,12,10000),('e4caa3f6-9d40-4e76-87ad-6ea5987d0e4c','77e6332b-678b-4be1-8165-10c105e619c0','https://ruigedist.oss-cn-hongkong.aliyuncs.com/SIXone1.jpg','Intelligent central air conditioning cooling windy system and medical atomization function.','1577980552657','Microcomputer control，temperature and humidity can be adjusted automatically.,Unique double-deck thermostat cover structure，silent technology is adopted with operating windows to ensure pets’ rest., Light is adjustable with multistage，simulate different nature and treatment environment., Equipped with air filter，dust removal and antibacterial effect is good.,Anion generator is equipped to purify air，to speed up the small animals to cure., With ultraviolet sterilization system.,Built-in medical atomizer.,Equipped with Co2 concentration monitor.','Veterinary ICU',0,NULL,0,NULL,NULL),('84c471f8-2563-41a1-892c-7978d32a337e','2d4e1e10-c221-4dbd-b454-cf0cb8be1d96','https://ruigedist.oss-cn-hongkong.aliyuncs.com/TWICEtwo.jpg','Special design for veterinary hospital. Bring more convinience.','1577980552658',' Images can be acquired dynamically and statically during Operation., Excellent images can be realized for diagnosis.,Generator，tube，I.I，collimator，multi-function photography bed，workstation，display unit，control unit etc.,380V,50kw, 630ma and 220V，22kw, 200ma.','OTF 6000',0,NULL,0,NULL,NULL),('56e0a9c0-28e0-45b7-8111-26ccfb3a7c81','1bcc4e91-b831-44b6-8b5e-654a179c9c3d','https://ruigedist.oss-cn-hongkong.aliyuncs.com/FIRSTone.jpg','Classic veterinary x ray machine, easy to upgraded to be DR in the future. ','1584022322675','16kw/28kw possible to choose. , Touch screen to set parameter., High frequency high voltage generator.,Classic x ray table,tube column possible to move right and left., Easy installation, small occupation space, Excellent image quality，wide clinical application. , Designed for use with Flat panel detector, Film and Computed Radiology, Size: 1500mm(L)*850mm(W)*1910mm(H), OEM/ODM x ray table is available.','KVET-500',0,'Classic veterinary x ray machine, easy to upgraded to be DR in the future. ',0,10,80000),('4ddaf14e-ac87-4bec-ac60-de2230d137cb','2d4e1e10-c221-4dbd-b454-cf0cb8be1d96','https://ruigedist.oss-cn-hongkong.aliyuncs.com/TWICEthree.jpg','Integrated with fluoroscopy and Photography function together, the Best choice for veterinary hospitals.','1577980552658','1. Images can be acquired dynamically and statically during Operation.,2. X-ray generator，X-ray tube，panel，collimator, multi-function photography bed，workstation，display unit，control unit etc. ,380V,50kw, 630ma and 220V，22kw, 200ma.,Suspension design, save hospital space, improve equipment utilization, Multifunctional surgical bed.','OTF 7000',0,NULL,0,NULL,NULL),('dece948b-703e-45c3-915a-f8b00c56963d','0a48a425-c634-44e6-8bfd-196ca4640db3','https://ruigedist.oss-cn-hongkong.aliyuncs.com/fif.png','Equipped with portable stand, onto which all major components are installed.','1577980552658',' The device is designed with both standard non-rebreathing and cycled breathing circuits,  Applied to inhalation anesthesia for cats, dogs, monkeys, pigs and other animals within 50kg,Two drug-filling ways of Pour-Fil and Easy-Fil,two anesthetic agents of Isoflurane and Sevoflurane are available','Anesthesia machine',0,NULL,0,NULL,NULL),('9b5419d2-9b7c-4c9b-abc5-ae3acd739b04','9b706e3a-b5ba-42bb-881e-e3b3f7d7c2ef','https://ruigedist.oss-cn-hongkong.aliyuncs.com/THIRDone.jpg','It is a portable veterinary color Doppler system with good performance at low cost which make it affordable for clinics or hospitals.','1577980552658',' Superior image performance and diverse applications. , Advanced imaging technology and ergonomic design., Applicable to scan different animals such as farm animals, pets, etc. ,Applicable to scan equine, bovine, ovine, swine, feline, etc., Powerful measurement software can provide comprehensive diagnostic bases., Compact size and light weight.,Possible to perform anywhere, anytime.','HD501',1,NULL,0,NULL,NULL),('69799b24-8cd8-48de-bf88-f4c0f92cf270','9b706e3a-b5ba-42bb-881e-e3b3f7d7c2ef','https://ruigedist.oss-cn-hongkong.aliyuncs.com/THIRDtwo.jpg','It is Ruige’s new generation portable color doppler ultrasound based on advanced PC platform, which offers a new choice for ultrasound clinical application.','1577980552658','PHI+Frequency composite technology,Space compound imaging technology,Speckle noise suppression technology,B、C、PW、BCD, The multi-beam parallel processing technology, Vascular intima-media automatic measurement,  One Touch Optimize,Angle of Display screen possible to change,Built-in rechargeable lithium-ion battery ','HD 502',0,NULL,0,NULL,NULL),('deb599f2-5715-40bf-ba09-36208db902ae','9b706e3a-b5ba-42bb-881e-e3b3f7d7c2ef','https://ruigedist.oss-cn-hongkong.aliyuncs.com/THIRDthree.jpg','It is featured with integrated ultrasound solutions, optimal image quality and comprehensive functions','1577980552658','High resolution,18.5 inch medical high definition LCD monitor.,Advanced imaging technology., Measurement package meet with clinical needs of different applications., B/C/PW/CW/BCD triplex imaging, Wide-angle Steer scanning imaging, Panoramic imaging., Efficient workflow provides easy operation experience to users.,Provide mobile standby.','HD 601',0,NULL,0,NULL,NULL),('96579e0c-318b-4f73-b99f-18cc269ff806','72120cfe-0a11-4fa6-aaf2-8d860d88cc58','https://ruigedist.oss-cn-hongkong.aliyuncs.com/xixin.jpg','We have different kinds of stainless steel surgery tables for selection, like standard one, homothermal type and two-way inclining type.','1577980552658','The operation table is made of 304 high quality stainless steel, anti-corrosion and anti-acid to prevent rust.,Equipped with stainless steel movable mesh, flat mesh and arc mesh for selection.,Easy operation, steady lifting.,Locking is firm.,Equipped with touch switch for lifting，\r\nDimension: L:1300. W:600. H:450-1000.\r\n','Veterinary Surgery Table',1,NULL,0,NULL,NULL),('f6430bcf-4fc5-4ed1-ab87-130bb456e24a','72120cfe-0a11-4fa6-aaf2-8d860d88cc58','https://ruigedist.oss-cn-hongkong.aliyuncs.com/buxiugang.png','Dog cages, cat cages, pet show cages, oxygen cages, injection cages and so on, also we can manufacture as requqired. ','1577980552658','Reasonable construction, strong bearing pressure, sturdy and durable.,Special sliding design of lock system, good security., Pedal grid and cage door is welded by high frequency and high current., Pedal grid and cage door is welded by high frequency and high current.,The under cage is designed with activity board, it will become big cage after taking off board. ,The bottom moves the brake wheel, convenient to move and fix. ,Cage is made of 304 stainless steel.,Dimension：L: 1220. W: 700. H: 1580.','Veterinary cages',0,NULL,0,NULL,NULL),('7d5c8d2a-acd3-4c82-9810-b57cab3ff0fd','72120cfe-0a11-4fa6-aaf2-8d860d88cc58','https://ruigedist.oss-cn-hongkong.aliyuncs.com/sixin5.jpg','Multifunctional desk with diagnosis, weigh, treatment function. ','1577980552658','Surface seamless connection., Simple design, easy to clean., L: 1000. W:550. H: 800.','Veterinary weighing and treatment table',0,NULL,0,NULL,NULL),('6db3ab70-8584-41b2-ae84-fe4eb0bb80e3','72120cfe-0a11-4fa6-aaf2-8d860d88cc58','https://ruigedist.oss-cn-hongkong.aliyuncs.com/sixin4.jpg','Different types, multifunctional type and pedal lifting type.','1577980552658','perigon angle design, without dead angle.,convenient to clean. ,Equipped with movable tap, possible to clean far side. , Intensified stainless steel drawer slide.,L: 1400. W: 600. H: 880.\r\n','Veterinary treatment desk',0,NULL,0,NULL,NULL),('eb5d0608-de75-45ef-a274-dcf2298b35e8','e946c8a5-5165-4473-9bc6-68d7fa3f0c5c','https://ruigedist.oss-cn-hongkong.aliyuncs.com/IMG_2772.JPG','Very competetive products with very good quality','1577980552658','Made in China\r\nSpecial for vet use\r\n','Vet Fundus Camera',0,NULL,0,NULL,NULL),('f8036d62-b19f-4d47-9290-503024c21414','e24ee747-2294-4cfc-9aad-b723bb42b5f1','https://ruigedist.oss-cn-hongkong.aliyuncs.com/seventh.png','Easy operation, high accuracy rate and lifelong technical guidance. ','1577980552658',' Easy Operation：draw blood，centrifuge blood，test，no need experience,Fast：totally 40 minutes will be ok,Accuracy rate：above 96%,Service：lifelong technical guidance,Operation Method：draw venous bloodand centrifuge, extract 80ul blood serum，drop on reagent card，data is automatically read after 15 minutes，no need any buffer solution，serum is directy detected','Progesterone testing machine',0,NULL,0,NULL,NULL),('35cbd4e7-1f0c-4843-bc03-f5ec7c34ddb9','6fe304ca-ad98-4c82-8168-4763a13bdc91','https://ruigedist.oss-cn-hongkong.aliyuncs.com/eghith.png','3-channel Veterinary ECG','1577980552658','Well-designed membrane keypad,7 leads simultaneous acquisition,Complete filters,Automatic measurements,Built-in high resolution thermal printer,External USB printer (optional),Large internal memory which can be enlarged by USB flash disk,Built-in data management,Smart ECG Viewer software for data management on PC (optional),LAN connections\r\n\r\n','Veterinary ECG',0,NULL,0,NULL,NULL),('dc02c413-050b-4abe-a2dc-bce37dbcfc05','6fe304ca-ad98-4c82-8168-4763a13bdc91','https://ruigedist.oss-cn-hongkong.aliyuncs.com/sevenin.jpg','it is a PC-based ECG solution for veterinary, which includes a precise data sampling module and a suite of powerful PC sofware. ','1577980552658','6/7 leads simultaneous acquisition, Complete filters, Automatic measurements,Multi-format reports transferrable via Email\r\n\r\n','Veterinary PC ECG',0,NULL,0,NULL,NULL),('7f7d80e2-4ed5-447a-8c6f-949c597eb479','72120cfe-0a11-4fa6-aaf2-8d860d88cc58','https://ruigedist.oss-cn-hongkong.aliyuncs.com/sixin2.jpg','Different types for choice, the best choice for hospitals.','1577980552658','Equipped with gimbal brake, board, drawer,L: 700. W: 450. H: 800.,Made of 304 stainless steel，anti-corrosion and anti-acid to prevent rust,Can be manufacture as required.\r\n','Surgical Support Table',0,NULL,0,NULL,NULL),('be67e842-9f36-4ca5-917b-2749e04a7409','85022a19-9d60-4885-ab35-12881c7434ec','https://ruigedist.oss-cn-hongkong.aliyuncs.com/ninth.png','Patient care and wound','1577980552659','Patient care and wound','Patient care and wound',0,NULL,0,NULL,NULL),('89a530cf-d052-49c9-8621-5caec8fdd721','1bcc4e91-b831-44b6-8b5e-654a179c9c3d','http://ruigedist.oss-cn-hongkong.aliyuncs.com/upload_f0ba25f72bd3d150ed30358a51b0f3a9.png','奥迪','1584022286355','阿斯顿','阿斯顿',0,'阿斯顿',1,0,0),('dfcae181-ff43-4367-855e-cf30ce3e9d3d','1bcc4e91-b831-44b6-8b5e-654a179c9c3d','http://ruigedist.oss-cn-hongkong.aliyuncs.com/upload_b88e44aff915bd448a619c8848551845.png','是否有规格测试','1584862417254','ads ','是否有规格测试',0,'是否有规格测试',1,20,120);
/*!40000 ALTER TABLE `product_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_sku`
--

DROP TABLE IF EXISTS `product_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product_sku` (
  `sku_id` int(10) NOT NULL AUTO_INCREMENT,
  `p_id` varchar(50) DEFAULT NULL,
  `price` decimal(6,2) NOT NULL,
  `stock` int(10) DEFAULT (0),
  `spec_data` text,
  `is_used` int(2) DEFAULT (1),
  PRIMARY KEY (`sku_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_sku`
--

LOCK TABLES `product_sku` WRITE;
/*!40000 ALTER TABLE `product_sku` DISABLE KEYS */;
INSERT INTO `product_sku` VALUES (1,'255be84b-0e9d-4db9-9a39-1bd13e55a129',40.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(2,'255be84b-0e9d-4db9-9a39-1bd13e55a129',40.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(3,'255be84b-0e9d-4db9-9a39-1bd13e55a129',40.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(4,'255be84b-0e9d-4db9-9a39-1bd13e55a129',40.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(5,'89a530cf-d052-49c9-8621-5caec8fdd721',404.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(6,'89a530cf-d052-49c9-8621-5caec8fdd721',402.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(7,'89a530cf-d052-49c9-8621-5caec8fdd721',40.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(8,'89a530cf-d052-49c9-8621-5caec8fdd721',40.00,50,'[{\"spec_name\":\"爱心\",\"spec_name_id\":3,\"spec_value\":\"两个\",\"spec_value_id\":6},{\"spec_name\":\"压缩\",\"spec_name_id\":4,\"spec_value\":\"白色\",\"spec_value_id\":8}]',1),(9,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',10.00,20,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"是的\",\"spec_value_id\":9},{\"spec_name\":\"是吗\",\"spec_name_id\":6,\"spec_value\":\"是的\",\"spec_value_id\":11}]',0),(10,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',30.00,40,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"是的\",\"spec_value_id\":9},{\"spec_name\":\"是吗\",\"spec_name_id\":6,\"spec_value\":\"不是\",\"spec_value_id\":12}]',0),(11,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',50.00,60,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"不是\",\"spec_value_id\":10},{\"spec_name\":\"是吗\",\"spec_name_id\":6,\"spec_value\":\"是的\",\"spec_value_id\":11}]',0),(12,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',70.00,80,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"不是\",\"spec_value_id\":10},{\"spec_name\":\"是吗\",\"spec_name_id\":6,\"spec_value\":\"不是\",\"spec_value_id\":12}]',0),(13,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',10.00,30,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"是的\",\"spec_value_id\":9},{\"spec_name\":\"是吗\",\"spec_name_id\":6,\"spec_value\":\"是的\",\"spec_value_id\":11}]',0),(14,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',30.00,20,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"不是\",\"spec_value_id\":10},{\"spec_name\":\"是吗\",\"spec_name_id\":6,\"spec_value\":\"是的\",\"spec_value_id\":11}]',0),(15,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',10.00,0,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"是的\",\"spec_value_id\":9}]',0),(16,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',10.00,0,'[{\"spec_name\":\"是否变态\",\"spec_name_id\":5,\"spec_value\":\"不是\",\"spec_value_id\":10}]',0),(17,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',10.00,20,'[{\"spec_name\":\"撒大\",\"spec_name_id\":7,\"spec_value\":\"奥迪\",\"spec_value_id\":13}]',0),(18,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',10.00,0,'[{\"spec_name\":\"奥迪\",\"spec_name_id\":8,\"spec_value\":\"的\",\"spec_value_id\":14}]',0),(19,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',10.00,10,'[{\"spec_name\":\"奥迪\",\"spec_name_id\":8,\"spec_value\":\"奥迪七系\",\"spec_value_id\":14},{\"spec_name\":\"颜色\",\"spec_name_id\":9,\"spec_value\":\"黑色\",\"spec_value_id\":16}]',1),(20,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',20.00,20,'[{\"spec_name\":\"奥迪\",\"spec_name_id\":8,\"spec_value\":\"奥迪七系\",\"spec_value_id\":14},{\"spec_name\":\"颜色\",\"spec_name_id\":9,\"spec_value\":\"白色\",\"spec_value_id\":17}]',1),(21,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',30.00,30,'[{\"spec_name\":\"奥迪\",\"spec_name_id\":8,\"spec_value\":\"奥迪八系\",\"spec_value_id\":15},{\"spec_name\":\"颜色\",\"spec_name_id\":9,\"spec_value\":\"黑色\",\"spec_value_id\":16}]',1),(22,'dfcae181-ff43-4367-855e-cf30ce3e9d3d',40.00,40,'[{\"spec_name\":\"奥迪\",\"spec_name_id\":8,\"spec_value\":\"奥迪八系\",\"spec_value_id\":15},{\"spec_name\":\"颜色\",\"spec_name_id\":9,\"spec_value\":\"白色\",\"spec_value_id\":17}]',1);
/*!40000 ALTER TABLE `product_sku` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_type`
--

DROP TABLE IF EXISTS `product_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product_type` (
  `id` char(50) NOT NULL,
  `parentId` varchar(20) NOT NULL,
  `name` varchar(50) NOT NULL,
  `descript` text NOT NULL,
  `updateTime` varchar(20) NOT NULL,
  `sort` int(11) NOT NULL,
  `src` varchar(255) DEFAULT NULL COMMENT '分类产品的图片',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_type`
--

LOCK TABLES `product_type` WRITE;
/*!40000 ALTER TABLE `product_type` DISABLE KEYS */;
INSERT INTO `product_type` VALUES ('0a48a425-c634-44e6-8bfd-196ca4640db3','0','ANESTHESIA MACHINE','Equipped with portable stand, onto which all major components are installed.','1577980552644',4,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/fif.png'),('1bcc4e91-b831-44b6-8b5e-654a179c9c3d','','X-RAY MACHINE','Classic veterinary x ray machine, easy to upgraded to be DR in the future. ','1580827663435',0,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/FIRSTtwo.jpg'),('2d4e1e10-c221-4dbd-b454-cf0cb8be1d96','0','FLUOROSCOPY MACHINE','Movable operation table, the highest cost-effective product.','1577980552643',1,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/TWICEone.jpg'),('6fe304ca-ad98-4c82-8168-4763a13bdc91','0','Monitoring','3-channel Veterinary ECG','1577980552644',6,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/eghith.png'),('72120cfe-0a11-4fa6-aaf2-8d860d88cc58','0','STAINLESS STEEL INSTRUMENTS','Dog cages, cat cages, pet show cages, oxygen cages, injection cages and so on, also we can manufacture as requqired. ','1577980552644',5,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/xixin.jpg'),('77e6332b-678b-4be1-8165-10c105e619c0','0','Laboratory Instruments','3-part 23 parameters hematology analyzer','1577980552644',3,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/fourth12.png'),('85022a19-9d60-4885-ab35-12881c7434ec','0','Patient care and wound','Patient care and wound','1577980552644',8,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/ninth.png'),('9b706e3a-b5ba-42bb-881e-e3b3f7d7c2ef','0','ULTRASOUND','It is a portable veterinary color Doppler system with good performance at low cost which make it affordable for clinics or hospitals.','1577980552644',2,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/THIRDone.jpg'),('e24ee747-2294-4cfc-9aad-b723bb42b5f1','0','Breeding Series','Easy operation, high accuracy rate and lifelong technical guidance. ','1577980552644',7,'https://ruigedist.oss-cn-hongkong.aliyuncs.com/seventh.png');
/*!40000 ALTER TABLE `product_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_cart`
--

DROP TABLE IF EXISTS `shop_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shop_cart` (
  `cart_id` int(10) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL COMMENT '用户id',
  `p_id` varchar(50) DEFAULT NULL COMMENT '产品id',
  `sku_id` int(10) DEFAULT NULL COMMENT '产品规格组合id',
  `status` int(2) NOT NULL COMMENT '购物车状态1：正常 0:删除',
  `make_time` int(20) NOT NULL COMMENT '加入购物车时间',
  PRIMARY KEY (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_cart`
--

LOCK TABLES `shop_cart` WRITE;
/*!40000 ALTER TABLE `shop_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order`
--

DROP TABLE IF EXISTS `shop_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shop_order` (
  `order_id` int(20) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `order_code` varchar(50) NOT NULL COMMENT '订单号',
  `total_price` int(20) NOT NULL COMMENT '总价格',
  `email` varchar(50) NOT NULL COMMENT '下单时留的邮箱',
  `phone` varchar(50) NOT NULL COMMENT '下单时留的电话',
  `address` varchar(255) NOT NULL COMMENT '下单时留的地址',
  `others` text COMMENT '其他备注',
  `status` int(2) NOT NULL COMMENT '订单状态0 未付款 1已付款,-1 已删除',
  `make_time` int(20) NOT NULL COMMENT '订单生成时间',
  `pay_time` int(20) DEFAULT NULL COMMENT '订单支付时间',
  `update_time` int(20) NOT NULL COMMENT '订单更新时间',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order`
--

LOCK TABLES `shop_order` WRITE;
/*!40000 ALTER TABLE `shop_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order_item`
--

DROP TABLE IF EXISTS `shop_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `shop_order_item` (
  `order_item_id` int(20) NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL,
  `p_id` varchar(50) DEFAULT NULL COMMENT '产品id',
  `sku_id` int(10) DEFAULT NULL COMMENT '产品规格组合id',
  `num` int(5) NOT NULL COMMENT '购买数量',
  `price` int(20) NOT NULL COMMENT '购买时的单价',
  `make_time` int(20) NOT NULL COMMENT '记录生成时间',
  PRIMARY KEY (`order_item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order_item`
--

LOCK TABLES `shop_order_item` WRITE;
/*!40000 ALTER TABLE `shop_order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spec_name`
--

DROP TABLE IF EXISTS `spec_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `spec_name` (
  `spec_name_id` int(10) NOT NULL AUTO_INCREMENT,
  `p_id` varchar(50) NOT NULL,
  `value` varchar(10) NOT NULL,
  `is_used` int(2) NOT NULL DEFAULT (1),
  PRIMARY KEY (`spec_name_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spec_name`
--

LOCK TABLES `spec_name` WRITE;
/*!40000 ALTER TABLE `spec_name` DISABLE KEYS */;
INSERT INTO `spec_name` VALUES (1,'255be84b-0e9d-4db9-9a39-1bd13e55a129','颜色',1),(2,'255be84b-0e9d-4db9-9a39-1bd13e55a129','大小d',1),(3,'89a530cf-d052-49c9-8621-5caec8fdd721','爱心',1),(4,'89a530cf-d052-49c9-8621-5caec8fdd721','压缩',1),(5,'dfcae181-ff43-4367-855e-cf30ce3e9d3d','是否变态',0),(6,'dfcae181-ff43-4367-855e-cf30ce3e9d3d','是吗',0),(7,'dfcae181-ff43-4367-855e-cf30ce3e9d3d','撒大',0),(8,'dfcae181-ff43-4367-855e-cf30ce3e9d3d','奥迪',1),(9,'dfcae181-ff43-4367-855e-cf30ce3e9d3d','颜色',1);
/*!40000 ALTER TABLE `spec_name` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `spec_value`
--

DROP TABLE IF EXISTS `spec_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `spec_value` (
  `spec_value_id` int(10) NOT NULL AUTO_INCREMENT,
  `spec_name_id` int(10) DEFAULT NULL,
  `value` varchar(10) NOT NULL,
  `is_used` int(2) NOT NULL DEFAULT (1),
  PRIMARY KEY (`spec_value_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `spec_value`
--

LOCK TABLES `spec_value` WRITE;
/*!40000 ALTER TABLE `spec_value` DISABLE KEYS */;
INSERT INTO `spec_value` VALUES (1,1,'黑色',1),(2,1,'白色',1),(3,2,'大的',1),(4,2,'小的',1),(5,3,'一个',1),(6,3,'两个',1),(7,4,'黑色',1),(8,4,'白色',1),(9,5,'是的',0),(10,5,'不是',0),(11,6,'是的',1),(12,6,'不是',0),(13,7,'奥迪',0),(14,8,'奥迪七系',1),(15,8,'奥迪八系',1),(16,9,'黑色',1),(17,9,'白色',1);
/*!40000 ALTER TABLE `spec_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `uid` int(10) NOT NULL AUTO_INCREMENT,
  `u_name` varchar(255) DEFAULT NULL,
  `p_word` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `make_time` int(20) DEFAULT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-03-25 23:13:50

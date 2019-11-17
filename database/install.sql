-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: recline
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `age_ratings`
--

DROP TABLE IF EXISTS `age_ratings`;

CREATE TABLE `age_ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'E.g. "U"',
  `scheme` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'E.g. "BBFC".',
  `minAge` int(11) DEFAULT NULL COMMENT 'Minimum suggested age in years.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Ordered set of age ratings. Accounts for various schemes.';


--
-- Table structure for table `client_users`
--

DROP TABLE IF EXISTS `client_users`;

CREATE TABLE `client_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isPrimary` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Users on clients';

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='System clients (Usually TVs)';

--
-- Table structure for table `content_types`
--

DROP TABLE IF EXISTS `content_types`;

CREATE TABLE `content_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `credited_people`
--

DROP TABLE IF EXISTS `credited_people`;

CREATE TABLE `credited_people` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `biography` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `dateOfBirth` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `credits`
--

DROP TABLE IF EXISTS `credits`;

CREATE TABLE `credits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mediaId` int(11) DEFAULT NULL,
  `personId` int(11) DEFAULT NULL,
  `role` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `created` datetime DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `extensions`
--

DROP TABLE IF EXISTS `extensions`;

CREATE TABLE `extensions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `active` int(1) DEFAULT NULL,
  `version` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `npmPackage` varchar(80) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;

CREATE TABLE `favourites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mediaId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `forgottokens`
--

DROP TABLE IF EXISTS `forgottokens`;

 
CREATE TABLE `forgottokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `expires` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `TOKEN` (`token`),
  KEY `USER` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `history`
--

DROP TABLE IF EXISTS `history`;

 
CREATE TABLE `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `contentId` int(11) DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `contentType` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;

 
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentContentId` int(11) DEFAULT NULL COMMENT 'Includes media sets, other media (e.g. a trailer for a movie, which would be tagged as ''trailer'').',
  `parentContentType` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `title` varchar(130) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `ageRating` int(11) DEFAULT NULL,
  `ratingGlobal` float DEFAULT NULL,
  `ratingGlobalUsers` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL COMMENT 'In seconds.',
  `releaseDate` datetime DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `url` varchar(2000) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `createdBy` int(11) DEFAULT NULL,
  `platform` int(11) DEFAULT NULL,
  `metaJson` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=784 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `media_platforms`
--

DROP TABLE IF EXISTS `media_platforms`;

 
CREATE TABLE `media_platforms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `emucode` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;


--
-- Table structure for table `media_sets`
--

DROP TABLE IF EXISTS `media_sets`;

 
CREATE TABLE `media_sets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentSet` int(11) DEFAULT NULL,
  `title` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `media_types`
--

DROP TABLE IF EXISTS `media_types`;

 
CREATE TABLE `media_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `ranks`
--

DROP TABLE IF EXISTS `ranks`;

 
CREATE TABLE `ranks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `isDefault` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `tagcontent`
--

DROP TABLE IF EXISTS `tagcontent`;

 
CREATE TABLE `tagcontent` (
  `tagId` int(11) NOT NULL,
  `contentTypeId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `createdUtc` datetime NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `Tag` (`tagId`)
) ENGINE=InnoDB AUTO_INCREMENT=839 DEFAULT CHARSET=utf8;


--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;

 
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tag` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;


--
-- Table structure for table `templates`
--

DROP TABLE IF EXISTS `templates`;

 
CREATE TABLE `templates` (
  `templateID` int(11) NOT NULL AUTO_INCREMENT,
  `subject` text,
  `html` text,
  `text` text,
  `sms` text,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`templateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `timers`
--

DROP TABLE IF EXISTS `timers`;

 
CREATE TABLE `timers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(400) DEFAULT NULL,
  `description` text,
  `mediaId` int(11) DEFAULT NULL,
  `titleToRecord` varchar(400) DEFAULT NULL,
  `blockReplays` int(1) NOT NULL DEFAULT '1',
  `previousDescription` text,
  `cronSchedule` text,
  `streamId` varchar(100) DEFAULT NULL,
  `provider` varchar(45) DEFAULT NULL,
  `duration` int(10) unsigned DEFAULT NULL,
  `created` int(12) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;

 
CREATE TABLE `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(32) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `assigned` datetime DEFAULT NULL,
  `expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `USER_TOKEN` (`user`,`token`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;

 
CREATE TABLE `uploads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Tracks uploads.';


--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

 
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayName` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `passhash` varchar(270) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `ui` int(11) DEFAULT NULL,
  `theme` text CHARACTER SET utf8 COLLATE utf8_unicode_ci,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `active` int(1) DEFAULT '1',
  `dateOfBirth` datetime DEFAULT NULL,
  `allowedAgeRating` int(11) DEFAULT NULL COMMENT 'Override - If not specified, the allowed rating will be computed from the DOB.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


--
-- Dumping data for table `age_ratings`
--

LOCK TABLES `age_ratings` WRITE;
/*!40000 ALTER TABLE `age_ratings` DISABLE KEYS */;
INSERT INTO `age_ratings` VALUES (1,'U','BBFC',0),(2,'G','MPAA',0),(3,'PG','BBFC',0),(4,'PG','MPAA',0),(5,'12A','BBFC',12),(6,'12','BBFC',12),(7,'PG-13','MPAA',13),(8,'15','BBFC',15),(9,'R','MPAA',17),(10,'NC-17','MPAA',17),(11,'18','BBFC',18),(12,'R18','BBFC',18);
/*!40000 ALTER TABLE `age_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `content_types`
--

LOCK TABLES `content_types` WRITE;
/*!40000 ALTER TABLE `content_types` DISABLE KEYS */;
INSERT INTO `content_types` VALUES (1,'media'),(2,'credited_people'),(3,'media_sets'),(4,'extensions');
/*!40000 ALTER TABLE `content_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `media_platforms`
--

LOCK TABLES `media_platforms` WRITE;
/*!40000 ALTER TABLE `media_platforms` DISABLE KEYS */;
INSERT INTO `media_platforms` VALUES (1,'Wii','wii'),(2,'GameCube','gamecube'),(3,'PlayStation 1','ps1'),(4,'PlayStation 2','ps2'),(5,'PlayStation 3','ps3'),(6,'PlayStation 4','ps4'),(7,'Nintendo DS','ds'),(8,'Xbox 360','xbox360'),(9,'Xbox One','xboxone'),(10,'PlayStation Portable','psp'),(11,'Xbox','xbox'),(12,'Nintendo Entertainment System','nes'),(13,'Super Nintendo Entertainment System','snes'),(14,'Master System','mastersystem'),(15,'Wii U','wiiu');
/*!40000 ALTER TABLE `media_platforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `media_types`
--

LOCK TABLES `media_types` WRITE;
/*!40000 ALTER TABLE `media_types` DISABLE KEYS */;
INSERT INTO `media_types` VALUES (1,'video'),(2,'audio'),(3,'photo'),(4,'game'),(5,'poster'),(6,'backdrop');
/*!40000 ALTER TABLE `media_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ranks`
--

LOCK TABLES `ranks` WRITE;
/*!40000 ALTER TABLE `ranks` DISABLE KEYS */;
INSERT INTO `ranks` VALUES (1,'guest',1),(2,'normal',1),(3,'admin',1);
/*!40000 ALTER TABLE `ranks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'action','Action',NULL),(2,'adventure','Adventure',NULL),(3,'animation','Animation',NULL),(4,'comedy','Comedy',NULL),(5,'crime','Crime',NULL),(6,'documentary','Documentary',NULL),(7,'drama','Drama',NULL),(8,'family','Family',NULL),(9,'fantasy','Fantasy',NULL),(10,'history','History',NULL),(11,'horror','Horror',NULL),(12,'music','Music',NULL),(13,'mystery','Mystery',NULL),(14,'romance','Romance',NULL),(15,'science_fiction','Science Fiction',NULL),(16,'tv_movie','TV Movie',NULL),(17,'thriller','Thriller',NULL),(18,'war','War',NULL),(19,'western','Western',NULL),(20,'live','Live',NULL),(21,'news','News',NULL),(22,'reality','Reality',NULL),(23,'soap','Soap',NULL),(24,'talk','Talk',NULL),(25,'politics','Politics',NULL);
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-16 23:52:11

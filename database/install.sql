--
-- Table structure for table `age_ratings`
--

DROP TABLE IF EXISTS `age_ratings`;
CREATE TABLE `age_ratings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'E.g. "U"',
  `scheme` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT 'E.g. "BBFC".',
  `minAge` int(11) DEFAULT NULL COMMENT 'Minimum suggested age in years.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Ordered set of age ratings. Accounts for various schemes.';

--
-- Dumping data for table `age_ratings`
--

INSERT INTO `age_ratings` VALUES (1,'U','BBFC',0),(2,'G','MPAA',0),(3,'PG','BBFC',0),(4,'PG','MPAA',0),(5,'12A','BBFC',12),(6,'12','BBFC',12),(7,'PG-13','MPAA',13),(8,'15','BBFC',15),(9,'R','MPAA',17),(10,'NC-17','MPAA',17),(11,'18','BBFC',18),(12,'R18','BBFC',18);

--
-- Table structure for table `client_users`
--

CREATE TABLE IF NOT EXISTS `client_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `isPrimary` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Users on clients';

--
-- Table structure for table `clients`
--

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='System clients (Usually TVs)';

--
-- Table structure for table `content_types`
--

DROP TABLE IF EXISTS `content_types`;
CREATE TABLE `content_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `content_types`
--

INSERT INTO `content_types` VALUES (1,'media'),(2,'credited_people'),(3,'media_sets'),(4,'extensions');

--
-- Table structure for table `credited_people`
--

CREATE TABLE IF NOT EXISTS `credited_people` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `biography` text COLLATE utf8_unicode_ci,
  `dateOfBirth` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `credits`
--

CREATE TABLE IF NOT EXISTS `credits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mediaId` int(11) DEFAULT NULL,
  `personId` int(11) DEFAULT NULL,
  `role` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `created` datetime DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `extensions`
--

CREATE TABLE IF NOT EXISTS `extensions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `active` int(1) DEFAULT NULL,
  `version` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `npmPackage` varchar(80) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `favourites`
--

CREATE TABLE IF NOT EXISTS `favourites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mediaId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `forgottokens`
--

CREATE TABLE IF NOT EXISTS `forgottokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(32) CHARACTER SET latin1 DEFAULT NULL,
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

CREATE TABLE IF NOT EXISTS `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `contentId` int(11) DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  `contentType` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `media`
--

CREATE TABLE IF NOT EXISTS `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentContentId` int(11) DEFAULT NULL COMMENT 'Includes media sets, other media (e.g. a trailer for a movie, which would be tagged as ''trailer'').',
  `parentContentType` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `title` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ageRating` int(11) DEFAULT NULL,
  `ratingGlobal` float DEFAULT NULL,
  `ratingGlobalUsers` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL COMMENT 'In seconds.',
  `releaseDate` datetime DEFAULT NULL,
  `rating` float DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `url` varchar(2000) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `media_sets`
--

CREATE TABLE IF NOT EXISTS `media_sets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentSet` int(11) DEFAULT NULL,
  `title` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `ranks`
--

-- No custom ranks for now
DROP TABLE IF EXISTS `ranks`;
CREATE TABLE `ranks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isDefault` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `ranks`
--

INSERT INTO `ranks` VALUES (1,'guest',1),(2,'normal',1),(3,'admin',1);

--
-- Table structure for table `media_tags`
--

CREATE TABLE IF NOT EXISTS `media_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mediaId` int(11) DEFAULT NULL,
  `tag` varchar(60) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT 0,
  `createdBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `tokens`
--

CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(32) CHARACTER SET latin1 DEFAULT NULL,
  `user` int(11) DEFAULT NULL,
  `assigned` datetime DEFAULT NULL,
  `expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `USER_TOKEN` (`user`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `templates`
--

CREATE TABLE IF NOT EXISTS `templates` (
  `templateID` int(11) NOT NULL AUTO_INCREMENT,
  `subject` text,
  `html` text,
  `text` text,
  `sms` text,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`TemplateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `displayName` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
  `passhash` varchar(270) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `ui` int(11) DEFAULT NULL,
  `theme` text COLLATE utf8_unicode_ci,
  `deleted` int(1) NOT NULL DEFAULT 0,
  `active` int(1) DEFAULT 1,
  `dateOfBirth` datetime DEFAULT NULL,
  `allowedAgeRating` int(11) DEFAULT NULL COMMENT 'Override - If not specified, the allowed rating will be computed from the DOB.',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Table structure for table `media_types`
--

DROP TABLE IF EXISTS `media_types`;
CREATE TABLE `media_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `media_types`
--

INSERT INTO `media_types` VALUES (1,'video'),(2,'audio'),(3,'photo'),(4,'game');
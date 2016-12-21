-- MySQL dump 10.13  Distrib 5.7.9, for osx10.9 (x86_64)
--
-- Host: localhost    Database: DeepMedia
-- ------------------------------------------------------
-- Server version	5.7.13

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `actor`
--

DROP TABLE IF EXISTS `actor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `gender` tinyint(1) NOT NULL COMMENT '0 is female\n1 is male',
  `email` char(50) NOT NULL,
  `phone` int(11) NOT NULL,
  `has_experience` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `UUID_UNIQUE` (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actor`
--

LOCK TABLES `actor` WRITE;
/*!40000 ALTER TABLE `actor` DISABLE KEYS */;
/*!40000 ALTER TABLE `actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `RUID` char(36) NOT NULL,
  `UUID` char(36) NOT NULL,
  `time` varchar(100) DEFAULT NULL,
  `recommender` varchar(100) DEFAULT NULL,
  `comment` tinytext,
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0: submitted\n1: reviewing\n2: rejected\n3: admitted',
  `submit_date_time` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress`
--

DROP TABLE IF EXISTS `progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `PUID` char(36) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` tinytext,
  `date_time` datetime DEFAULT NULL,
  `notify` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress`
--

LOCK TABLES `progress` WRITE;
/*!40000 ALTER TABLE `progress` DISABLE KEYS */;
/*!40000 ALTER TABLE `progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project`
--

DROP TABLE IF EXISTS `project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `PUID` char(36) NOT NULL,
  `UUID` varchar(45) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` mediumtext,
  `start_date_time` datetime DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0 hide\n1 show',
  PRIMARY KEY (`id`),
  UNIQUE KEY `PUID_UNIQUE` (`PUID`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project`
--

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
INSERT INTO `project` VALUES (1,'e695b504-c6d9-11e6-bfe9-950e846e9bbd',NULL,'asd','0','2016-11-15 01:29:00',1),(2,'2d8d6d6c-c6da-11e6-bfe9-950e846e9bbd',NULL,'asd','0','2016-11-15 01:29:00',1),(3,'ee282d40-c6db-11e6-bfe9-950e846e9bbd',NULL,'s','','2016-12-28 01:44:00',0),(4,'6b15d434-c6e0-11e6-bfe9-950e846e9bbd',NULL,'sdf','','2016-12-13 02:16:00',2),(5,'a85c602e-c6e0-11e6-bfe9-950e846e9bbd',NULL,'sd','','2016-12-21 02:18:00',1),(6,'2575fbb0-c6e1-11e6-bfe9-950e846e9bbd',NULL,'ddd','','2016-12-06 02:21:00',0),(7,'7ed659c0-c6e1-11e6-bfe9-950e846e9bbd',NULL,'dd','asdf','2016-12-15 02:24:00',0);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruit`
--

DROP TABLE IF EXISTS `recruit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recruit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `RUID` char(36) DEFAULT NULL,
  `PUID` char(36) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` mediumtext,
  `time` varchar(100) DEFAULT NULL,
  `cover` tinytext,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruit`
--

LOCK TABLES `recruit` WRITE;
/*!40000 ALTER TABLE `recruit` DISABLE KEYS */;
INSERT INTO `recruit` VALUES (1,'217271bc-c739-11e6-bfe9-950e846e9bbd',NULL,'sd','sdf','2016/12/13 12:48',NULL,2),(2,'28f92ad4-c739-11e6-bfe9-950e846e9bbd',NULL,'sdfsd','fddf','2016/12/06 12:51',NULL,0),(3,'51053c70-c739-11e6-bfe9-950e846e9bbd',NULL,'sdfs','dffd','2016/12/07 12:52',NULL,2);
/*!40000 ALTER TABLE `recruit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `RUID` char(36) NOT NULL,
  `UUID` char(36) NOT NULL,
  `comment` tinytext,
  `date_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,'UUID()','4f8350fa-c6ab-11e6-82d7-c5120b02e780','oh yeah man',NULL),(2,'4050d5ac-c6cf-11e6-bfe9-950e846e9bbd','4f8350fa-c6ab-11e6-82d7-c5120b02e780','fuck','2016-12-21 00:13:32');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UUID` char(36) NOT NULL,
  `openId` char(100) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `username` char(20) DEFAULT NULL,
  `password` char(200) DEFAULT NULL,
  `register_time` datetime DEFAULT NULL,
  `last_action_time` datetime DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `session` char(36) DEFAULT NULL,
  `session_start` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `UUID_UNIQUE` (`UUID`),
  UNIQUE KEY `openId_UNIQUE` (`openId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'4f8350fa-c6ab-11e6-82d7-c5120b02e780','0','trump','http://static.hdslb.com/images/member/noface.gif','admin','3iv8vz1oTfMPgwJIUDrf7lUB5rf9G+I8Ixxjn1jfojp4gPtDs=',NULL,NULL,1,'ceeaed85-2f77-bd78-8200-0f21fb470cd3','2016-12-21 15:02:57');
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

-- Dump completed on 2016-12-21 15:03:51

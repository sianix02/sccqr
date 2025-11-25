-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 24, 2025 at 11:44 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `scc`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int NOT NULL,
  `user_id` int NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_initial` varchar(5) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `user_id`, `first_name`, `middle_initial`, `last_name`, `email`) VALUES
(1, 2, 'Juan', 'A.', 'Dela Cruz', 'rysianbulala155@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `archive_history`
--

CREATE TABLE `archive_history` (
  `history_id` int NOT NULL,
  `student_id` bigint NOT NULL,
  `action` enum('archive','restore') NOT NULL,
  `action_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `performed_by` varchar(255) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `archive_history`
--

INSERT INTO `archive_history` (`history_id`, `student_id`, `action`, `action_date`, `performed_by`, `reason`, `notes`) VALUES
(1, 10003, 'archive', '2025-11-24 08:14:05', 'Admin', 'Manual archive', 'Archived from student management'),
(2, 10003, 'restore', '2025-11-24 08:33:34', 'Admin', NULL, 'Restored from archive'),
(3, 10003, 'archive', '2025-11-24 08:33:55', 'Admin', 'Manual archive', 'Archived from student management'),
(4, 10004, 'archive', '2025-11-24 08:34:16', 'Admin', 'Manual archive', 'Archived from student management'),
(5, 10005, 'archive', '2025-11-24 08:43:24', 'Admin', 'Manual archive', 'Archived from student management'),
(6, 10005, 'restore', '2025-11-24 08:43:45', 'Admin', NULL, 'Restored from archive'),
(7, 10004, 'restore', '2025-11-24 08:43:52', 'Admin', NULL, 'Restored from archive'),
(8, 10003, 'restore', '2025-11-24 08:43:54', 'Admin', NULL, 'Restored from archive'),
(9, 10003, 'archive', '2025-11-24 08:49:22', 'Admin', 'Manual archive', 'Archived from student management'),
(10, 10003, 'restore', '2025-11-24 10:27:57', 'Admin', NULL, 'Restored from archive'),
(11, 10003, 'archive', '2025-11-25 06:19:57', 'Admin', 'Manual archive', 'Archived from student management'),
(12, 10003, 'restore', '2025-11-25 06:20:06', 'Admin', NULL, 'Restored from archive'),
(13, 10003, 'archive', '2025-11-25 06:20:10', 'Admin', 'Manual archive', 'Archived from student management'),
(14, 10003, 'restore', '2025-11-25 06:20:38', 'Admin', NULL, 'Restored from archive'),
(15, 10003, 'archive', '2025-11-25 06:24:04', 'Admin', 'Manual archive', 'Archived from student management'),
(16, 10003, 'restore', '2025-11-25 06:24:35', 'Admin', NULL, 'Restored from archive'),
(17, 20220721155403, 'archive', '2025-11-25 07:18:21', 'Admin', 'Manual archive', 'Archived from student management'),
(18, 20220721155403, 'restore', '2025-11-25 07:34:09', 'Admin', NULL, 'Restored from archive'),
(19, 20220721155403, 'archive', '2025-11-25 07:35:01', 'Admin', 'Manual archive', 'Archived from student management'),
(20, 10003, 'archive', '2025-11-25 07:36:19', 'Admin', 'Manual archive', 'Archived from student management'),
(21, 10003, 'restore', '2025-11-25 07:36:24', 'Admin', NULL, 'Restored from archive'),
(22, 20220721155403, 'restore', '2025-11-25 07:36:26', 'Admin', NULL, 'Restored from archive'),
(23, 10003, 'archive', '2025-11-25 07:37:53', 'Admin', 'Manual archive', 'Archived from student management'),
(24, 10003, 'restore', '2025-11-25 07:37:59', 'Admin', NULL, 'Restored from archive');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_report`
--

CREATE TABLE `attendance_report` (
  `attendance_id` int NOT NULL,
  `student_id` bigint NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `date_time` datetime DEFAULT NULL,
  `time_in` time NOT NULL,
  `time_out` time DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance_report`
--

INSERT INTO `attendance_report` (`attendance_id`, `student_id`, `event_name`, `date_time`, `time_in`, `time_out`, `remarks`) VALUES
(51, 20220721155403, 'SCC night', '2025-11-22 16:37:00', '00:00:00', NULL, 'absent'),
(107, 20220721155403, 'Bonga Festival', '2025-11-21 08:47:00', '00:00:00', NULL, 'absent'),
(163, 20220721155403, 'Intramurals', '2025-11-22 08:46:00', '00:00:00', NULL, 'absent'),
(219, 20220721155403, 'Student Assembly', '2025-11-23 08:46:00', '00:00:00', NULL, 'absent'),
(225, 20220721155403, 'SEMINAR', '2025-11-24 11:44:13', '11:44:00', '11:44:00', 'present');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `event_id` int NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `event_date` datetime NOT NULL,
  `event_type` varchar(100) NOT NULL,
  `description` text,
  `qr_code_data` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Active','Completed','Cancelled') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`event_id`, `event_name`, `event_date`, `event_type`, `description`, `qr_code_data`, `created_at`, `status`) VALUES
(1, 'SCC night', '2025-11-22 16:37:00', 'PROGRAM', 'test', 'SIBONGA-SCC NIGHT-4:37:00 PM', '2025-11-22 08:37:36', 'Active'),
(2, 'Student Assembly', '2025-11-23 08:46:00', 'All Year Level', 'test', 'SIBONGA-STUDENT ASSEMBLY-8:46:00 AM', '2025-11-24 00:46:21', 'Active'),
(3, 'Intramurals', '2025-11-22 08:46:00', 'All Year Level', 'test', 'SIBONGA-INTRAMURALS-8:46:00 AM', '2025-11-24 00:46:47', 'Active'),
(4, 'Bonga Festival', '2025-11-21 08:47:00', 'All Year Level', 'test', 'SIBONGA-BONGA FESTIVAL-8:47:00 AM', '2025-11-24 00:47:35', 'Active'),
(5, 'Seminar', '2025-11-24 11:41:00', 'All Year Level', 'test', 'SIBONGA-SEMINAR-11:41:00 AM', '2025-11-24 03:42:04', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `adviser_id` int NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_initial` varchar(5) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `year_level_assigned` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`adviser_id`, `first_name`, `middle_initial`, `last_name`, `year_level_assigned`, `department`, `position`) VALUES
(6, 'Javan Alexandre', 'A.', 'Juario', '4th Year', 'BS Information Technology', 'Dean');

-- --------------------------------------------------------

--
-- Table structure for table `secret_question`
--

CREATE TABLE `secret_question` (
  `user_id` int NOT NULL,
  `secret_question_1` varchar(255) NOT NULL,
  `secret_question_2` varchar(255) NOT NULL,
  `secret_question_3` varchar(255) NOT NULL,
  `secret_question_4` varchar(255) NOT NULL,
  `secret_question_5` varchar(255) NOT NULL,
  `answer_1` varchar(255) NOT NULL,
  `answer_2` varchar(255) NOT NULL,
  `answer_3` varchar(255) NOT NULL,
  `answer_4` varchar(255) NOT NULL,
  `answer_5` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `secret_question`
--

INSERT INTO `secret_question` (`user_id`, `secret_question_1`, `secret_question_2`, `secret_question_3`, `secret_question_4`, `secret_question_5`, `answer_1`, `answer_2`, `answer_3`, `answer_4`, `answer_5`) VALUES
(2, 'What city were you born in?', 'What is your favorite food?', 'What is your father\'s middle name?', 'What is your favorite sport?', 'What is your dream destination?', '$2y$10$Bv62c13jVHedOri4pbGV/eiXtXuun8UTZO7sWSrl3shEQlluNZBOa', '$2y$10$JvVYuOJeDu.Xg7w/KT9UqOhaYfaWxrs7Prno9NBvq4GLrZkdnr49C', '$2y$10$Ut8geVXGt.mOauWWjTUawO59s8S4hgipembDS0H5OoV24Wv87OUC.', '$2y$10$sSMh5mPWstXhN0ygjKy3MuXl80xT9EnoC.bfze9SAc8ybucG7FBLO', '$2y$10$aDLLJhS7xqgD75Pn.Td9wep3j2KeTxv0Sh4RrycBQKBeG3K7HP6WO'),
(6, 'What city were you born in?', 'What is the name of your favorite teacher?', 'What is your favorite movie?', 'What is your hobby?', 'What is your favorite season?', '$2y$10$miLy4YofCnP0Psbq7bZwvuR/bmSgYCsXIfYBA6B.JJ69gqrJi/EWG', '$2y$10$damPGDXHJ0jwSbV1lEfiBOpNgx63W40ePRmAEj1Fl8RltYjehFeeS', '$2y$10$IEDpSrxHqRvcXIG2XLkgXekVZJN/fTAq.75kicFa9Lx2BMJYqCXhm', '$2y$10$7/cbX4Hd2akeoSOff4iF9ubTw/std4ryNPjVy.bQ/x.G.MLOOfxPi', '$2y$10$j4/angHs9vqzOagOzreSM.aJDEXbwuuePCBO9ww9Ufqu.eIHXLAMm'),
(59, 'What is your mother\\\'s maiden name?', 'What was your childhood nickname?', 'What is your father\\\'s middle name?', 'What is your favorite sport?', 'What is your dream destination?', '$2y$10$t85/93M7HY2a8KadgoD/MOv1SaVQF33wyvi5d9v2VHUVanjvuOBgW', '$2y$10$veHEmUNgfherBlZOkhx.zOuPjDlQd8eWq6JecwECWHuhrFJ2dyObW', '$2y$10$3/k2OovkYiOH31F.wypq/.4eIcMMO5MNfRUVgClltT3HUzLBwAo2q', '$2y$10$xNcACYQcRSv6fVvhcy27auGpgydYst.7WS/GXqkPu71yNoVmMWLUK', '$2y$10$FugHQ.r3Q2hIp9DiDkann.P9HvyWD3WpJ6ljMK7re2SmyU.OsrVde'),
(60, 'What is your mother\\\'s maiden name?', 'What is your favorite food?', 'What is your father\\\'s middle name?', 'What is your hobby?', 'What is your best friend\\\'s name?', '$2y$10$oPFrHcQJI79GPDvJ/MxMvetRySKJ1FFTKFBA5ifThf8BlBSfQdsc6', '$2y$10$h6jv1/QBmyziZBBiUTWvH.9XQt5ojYO.6BxyXfJKKcPVzm0PMhzJK', '$2y$10$gATUZ3MYwmjtgcjCgGkXd.3cjT3/WCtWrF1XsEp5emZ9rbg8RDuQ.', '$2y$10$dtq/jxM/D90qg2QsUluyiODS9snaab6U7wznDy5QvD7Z264N1RRHS', '$2y$10$CUboL1K1XcVXY.sNQ0NFS.xSWdU6rUnV0cf8SFcLmQv4pCHQSD6Zq'),
(61, 'What was the name of your first pet?', 'What is your dream job?', 'What was the name of your elementary school?', 'What is your hobby?', 'What is your best friend\\\'s name?', '$2y$10$rwL5wbMTWEuWoFTnwbXP2Og8FJdLvhFGnZlwnbwLeKnZuar4nb/fC', '$2y$10$cWbSK3zbt457G99iUgbD7OK5Vjyyk8galOTXYLgR8.dyiZHV6qoGS', '$2y$10$XuxKsAV0qBJSexxs7k1FR..Z/ozuWhpdkMEcBbeOKxoJqWNAt7F52', '$2y$10$tH58OntadbXGkm3u/Gv0c.EMWX19pJfk0sEi0KcUaSDZemifWS5E.', '$2y$10$E1JIk7jye/meNacnFOfUfObYSsKXKrki.f6smhvv3HUEZqBgmQKaW'),
(62, 'What city were you born in?', 'What was your childhood nickname?', 'What is your favorite movie?', 'What is your hobby?', 'What is your best friend\\\'s name?', '$2y$10$uVTEXptoFP4BtGz1aq.H.OWDA91DpldY735GOxlMLVnDB9Ui/Roli', '$2y$10$6eY5TD7e.Nx8YMUC9VE3cuNJ6T2ypx2I9f6784FlA/hjX7UOIMIBq', '$2y$10$gpWSoV07NxWRbZJGDRFXPOD93bceUdxU6dZnUbmr091eGsqfTyh/W', '$2y$10$A6JCmabCg9AxL23JtJIY4.f2lGrYmZDdRijWv5Vt1czAnwJrzRWj6', '$2y$10$eE.DOQodNI1HfEmA1IHT5eDAAS1ZrCzzRIYd7u4l4qmINuegNJp7y'),
(63, 'What is your mother\\\'s maiden name?', 'What is the name of your favorite teacher?', 'What is your favorite movie?', 'What was your first job?', 'What is your best friend\\\'s name?', '$2y$10$w3CWqqr2Ip4Xl3m75x0yQeYauh7cid1adafuXbofIweXu1ftAfDM.', '$2y$10$rc/kMpAIaYPpB43OrOFIKeHZBG0bTnjoDjIFkqCzvOqkujWsf8Y1O', '$2y$10$9TlzbO/xqcs6vi14TYS1Ou6sZfGF5AhV4c0mKD5hOPVMvHgU9IWA.', '$2y$10$QzHdKgDF216UVIj2wn7UTOUP1BDLR6kKXkBR04bWCHS6QfX7XTW/e', '$2y$10$733R6NguNzcmEACQHIJnk.CJ3comesZzT6vyO0Z/4xdP626.is/Ym'),
(64, 'What is your mother\\\'s maiden name?', 'What was your childhood nickname?', 'What is your father\\\'s middle name?', 'What is your favorite subject?', 'What is your dream destination?', '$2y$10$/IRAtVMLWsWZw67pp17uCONklGyFtLlb4B19oFT0PlD2NGUaTrKQG', '$2y$10$fuzEUenuzjwUKchANovWjOIoy6qccEuLnaNBIssl454Q5lSZqqJKW', '$2y$10$fpnMh2ahnr6jwbWwEQMOdO3iVtg5ul0xCSHfHk4geNAdEXLc1/PDi', '$2y$10$rdprwNJolsFNqGt/7nxVB.GiHytSebqfDgg4vVia0ogpJHAFcXSrW', '$2y$10$qWZ6lAws3sj1pMXs0bKQYu2j/P1JOdssPFc.qYK6fWRdggBh1p6S6');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `user_id` int NOT NULL,
  `student_id` bigint NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_initial` varchar(5) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `year_level` varchar(255) NOT NULL,
  `sex` varchar(50) NOT NULL,
  `student_set` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`user_id`, `student_id`, `first_name`, `middle_initial`, `last_name`, `year_level`, `sex`, `student_set`, `course`) VALUES
(9, 10003, 'Pachico', 'O', 'Fernandez', '1st Year', 'Male', 'Set C', 'BS Information Technology'),
(10, 10004, 'Sarah', 'H', 'Martinez', '2nd Year', 'Female', 'Set B', 'BS Information Technology'),
(11, 10005, 'David', 'T', 'Rodriguez', '3rd Year', 'Male', 'Set A', 'BS Information Technology'),
(12, 10006, 'Jade Ivan', 'Y', 'Bringcola', '4th Year', 'Female', 'Set D', 'BS Information Technology'),
(13, 10007, 'James', 'K', 'Anderson', '1st Year', 'Male', 'Set B', 'BS Information Technology'),
(14, 10008, 'Jessica', 'E', 'Taylor', '2nd Year', 'Female', 'Set A', 'BS Information Technology'),
(15, 10009, 'Daniel', 'Q', 'Thomas', '3rd Year', 'Male', 'Set C', 'BS Information Technology'),
(16, 10010, 'Ashley', 'S', 'Moore', '4th Year', 'Female', 'Set B', 'BS Information Technology'),
(17, 10011, 'Christopher', 'O', 'Jackson', '1st Year', 'Male', 'Set A', 'BS Information Technology'),
(18, 10012, 'Amanda', 'S', 'White', '2nd Year', 'Female', 'Set C', 'BS Information Technology'),
(19, 10013, 'Matthew', 'X', 'Harris', '1st Year', 'Male', 'Set A', 'BS Business Administration'),
(20, 10014, 'Jennifer', 'I', 'Martin', '2nd Year', 'Female', 'Set B', 'BS Business Administration'),
(21, 10015, 'Joshua', 'Y', 'Thompson', '3rd Year', 'Male', 'Set C', 'BS Business Administration'),
(22, 10016, 'Elizabeth', 'U', 'Garcia', '4th Year', 'Female', 'Set A', 'BS Business Administration'),
(23, 10017, 'Andrew', 'C', 'Martinez', '1st Year', 'Male', 'Set B', 'BS Business Administration'),
(24, 10018, 'Stephanie', 'B', 'Robinson', '2nd Year', 'Female', 'Set C', 'BS Business Administration'),
(25, 10019, 'Ryan', 'Z', 'Clark', '3rd Year', 'Male', 'Set A', 'BS Business Administration'),
(26, 10020, 'Nicole', 'T', 'Rodriguez', '4th Year', 'Female', 'Set B', 'BS Business Administration'),
(27, 10021, 'Brandon', 'V', 'Lewis', '1st Year', 'Male', 'Set C', 'BS Business Administration'),
(28, 10022, 'Lauren', 'X', 'Lee', '2nd Year', 'Female', 'Set A', 'BS Business Administration'),
(29, 10023, 'Kevin', 'Z', 'Walker', '1st Year', 'Male', 'Set B', 'BS Criminology'),
(30, 10024, 'Rachel', 'D', 'Hall', '2nd Year', 'Female', 'Set C', 'BS Criminology'),
(31, 10025, 'Justin', 'V', 'Allen', '3rd Year', 'Male', 'Set A', 'BS Criminology'),
(32, 10026, 'Megan', 'R', 'Young', '4th Year', 'Female', 'Set B', 'BS Criminology'),
(33, 10027, 'Tyler', 'W', 'King', '1st Year', 'Male', 'Set C', 'BS Criminology'),
(34, 10028, 'Brittany', 'K', 'Wright', '2nd Year', 'Female', 'Set A', 'BS Criminology'),
(35, 10029, 'Jason', 'I', 'Lopez', '3rd Year', 'Male', 'Set B', 'BS Criminology'),
(36, 10030, 'Samantha', 'N', 'Hill', '4th Year', 'Female', 'Set C', 'BS Criminology'),
(37, 10031, 'Eric', 'Q', 'Scott', '1st Year', 'Male', 'Set A', 'BS Criminology'),
(38, 10032, 'Amber', 'Q', 'Green', '2nd Year', 'Female', 'Set B', 'BS Criminology'),
(39, 10033, 'Brian', 'H', 'Adams', '1st Year', 'Male', 'Set C', 'BS Secondary Education'),
(40, 10034, 'Melissa', 'N', 'Baker', '2nd Year', 'Female', 'Set A', 'BS Secondary Education'),
(41, 10035, 'Nathan', 'S', 'Gonzalez', '3rd Year', 'Male', 'Set B', 'BS Secondary Education'),
(42, 10036, 'Rebecca', 'Y', 'Nelson', '4th Year', 'Female', 'Set C', 'BS Secondary Education'),
(43, 10037, 'Jeremy', 'O', 'Carter', '1st Year', 'Male', 'Set A', 'BS Secondary Education'),
(44, 10038, 'Catherine', 'B', 'Mitchell', '2nd Year', 'Female', 'Set B', 'BS Secondary Education'),
(45, 10039, 'Sean', 'P', 'Perez', '3rd Year', 'Male', 'Set C', 'BS Secondary Education'),
(46, 10040, 'Michelle', 'W', 'Roberts', '4th Year', 'Female', 'Set A', 'BS Secondary Education'),
(47, 10041, 'Kyle', 'L', 'Turner', '1st Year', 'Male', 'Set B', 'BS Secondary Education'),
(48, 10042, 'Christina', 'P', 'Phillips', '2nd Year', 'Female', 'Set C', 'BS Secondary Education'),
(49, 10043, 'Aaron', 'R', 'Campbell', '1st Year', 'Male', 'Set A', 'Bachelor of Elementary Education'),
(50, 10044, 'Laura', 'R', 'Parker', '2nd Year', 'Female', 'Set B', 'Bachelor of Elementary Education'),
(51, 10045, 'Marcus', 'G', 'Evans', '3rd Year', 'Male', 'Set C', 'Bachelor of Elementary Education'),
(52, 10046, 'Hannah', 'F', 'Edwards', '4th Year', 'Female', 'Set A', 'Bachelor of Elementary Education'),
(53, 10047, 'Adam', 'K', 'Collins', '1st Year', 'Male', 'Set B', 'Bachelor of Elementary Education'),
(54, 10048, 'Olivia', 'K', 'Stewart', '2nd Year', 'Female', 'Set C', 'Bachelor of Elementary Education'),
(55, 10049, 'Jonathan', 'U', 'Sanchez', '3rd Year', 'Male', 'Set A', 'Bachelor of Elementary Education'),
(56, 10050, 'Grace', 'R', 'Morris', '4th Year', 'Female', 'Set B', 'Bachelor of Elementary Education'),
(57, 10051, 'Zachary', 'A', 'Rogers', '1st Year', 'Male', 'Set C', 'Bachelor of Elementary Education'),
(58, 10052, 'Sophia', 'B', 'Reed', '2nd Year', 'Female', 'Set A', 'Bachelor of Elementary Education'),
(60, 202208244590, 'Clark', 'P', 'Panucat', '4th Year', 'Male', 'Set C', 'BS Information Technology'),
(59, 20220721155403, 'Rysian Denver', 'O.', 'Bulala', '4th Year', 'Male', 'Set C', 'BS Information Technology'),
(63, 20220725112458, 'Joshua ', 'G', 'Sagolili ', '4th Year', 'Male', 'Set A', 'BS Information Technology'),
(62, 20220725125037, 'RODEL ', 'M', 'Samante', '4th Year', 'Male', 'Set C', 'BS Information Technology'),
(64, 20220727113410, 'Christian ', 'C. ', 'Guiwanon', '4th Year', 'Male', 'Set D', 'BS Information Technology'),
(61, 20220824100110, 'Den Mark', 'D', 'Coot', '4th Year', 'Male', 'Set C', 'BS Information Technology');

-- --------------------------------------------------------

--
-- Table structure for table `student_archive`
--

CREATE TABLE `student_archive` (
  `archive_id` int NOT NULL,
  `student_id` bigint NOT NULL,
  `archived_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `archive_reason` varchar(255) NOT NULL,
  `archived_by` varchar(255) DEFAULT 'Admin',
  `is_archived` tinyint(1) DEFAULT '1',
  `restored_date` datetime DEFAULT NULL,
  `restored_by` varchar(255) DEFAULT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `student_archive`
--

INSERT INTO `student_archive` (`archive_id`, `student_id`, `archived_date`, `archive_reason`, `archived_by`, `is_archived`, `restored_date`, `restored_by`, `notes`) VALUES
(1, 10003, '2025-11-25 07:37:53', 'Manual archive', 'Admin', 0, '2025-11-25 07:37:59', 'Admin', 'Archived from student management'),
(3, 10004, '2025-11-24 08:34:16', 'Manual archive', 'Admin', 0, '2025-11-24 08:43:52', 'Admin', 'Archived from student management'),
(4, 10005, '2025-11-24 08:43:24', 'Manual archive', 'Admin', 0, '2025-11-24 08:43:45', 'Admin', 'Archived from student management'),
(9, 20220721155403, '2025-11-25 07:35:01', 'Manual archive', 'Admin', 0, '2025-11-25 07:36:26', 'Admin', 'Archived from student management');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `username` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `password`, `role`, `username`) VALUES
(1, '$2y$10$5KKB9EmDejFOh9fb41MDgefnhOO.rd3BMnv/qK.Hi0D74ZamwJqom', 'student', 1),
(2, '$2y$10$lTl0h3WkaPBS9UyFDFVgOepc9wy3K1.s.VUj4z1eiZdNC1Yn05W8m', 'admin', 2),
(3, '$2y$10$vaf.IN9l00j0bmACdgd5FOysRfZBsmbZjLMwghVNag8IRVYj3bgmK', 'student', 3),
(4, '$2y$10$2OQJiUHl/hYfDnx60LTB8.mliMGytVzP4BTS8iv1PNkWCvjXmFX96', 'student', 4),
(5, '$2y$10$yodZwpsD4Q41Utn3ew.Po.kNcLKL/imOWEDcSdpKZbHWF7i50e1ge', 'student', 7),
(6, '$2y$10$oMgMrkgFJ2xaIl8Ak3kqZ.wFM05OgwHsEy7Jz7r3ziFRZ8XhzH50q', 'instructor', 123),
(7, '$2y$10$W16ih6WW5MkSTWpdmLDrw.BfV2XLs1Pmhdyoidt7dJ6XYkxYmrSUO', 'admin', 98),
(8, '$2y$10$ekk.4jh/rtPRXbd1CUpFneKuGj9HZudXAgJBRX3qMZ7hwb74KksKq', 'admin', 456),
(9, '$2y$10$7BiarXCiiyZg14Sp9FvsaOuwM4hUQI6BFv6R70SMYnua5SKLSaZAK', 'student', 10003),
(10, '$2y$10$bht2XDgNEySqkBk76McjTeiElYjjwdYC/eHSHLblgjS1704hWCrlC', 'student', 10004),
(11, '$2y$10$3lOTkM0eYXlHAOK3Q3r5Quv0gH1miLkrXBISeeWV87yOkW6rHtnOi', 'student', 10005),
(12, '$2y$10$63hwpmec/OUL4BBYETwA6enzN98kS5/i/XVWeagTo8.B5LxLAgF5K', 'student', 10006),
(13, '$2y$10$epGmBi7RY85g2ip0TFwXruWJ.ki1DDGQhQGEPlGrRK//fHGEJQBP2', 'student', 10007),
(14, '$2y$10$xOQN4k0eRM4eAy6y6DJ2R.M1FwoEQXAt7xfCNsAGsWhYf2B.vYPgG', 'student', 10008),
(15, '$2y$10$TqVvItWKLkh9Rek/W6SPR.H6fNGrjXFIGkBLK6dgtkWrUOI7BAaRW', 'student', 10009),
(16, '$2y$10$L/UQwbyuvzD/RY1ddyqjHOV2JuXwmV/ASpYTyK4yLRMcJt5OwBVdi', 'student', 10010),
(17, '$2y$10$mN4xRNJ01S3ha07BZvhvWOaqYGjlCAnCAFMULPN.iJR4SESqSh04.', 'student', 10011),
(18, '$2y$10$XeBSMIAtQCF4zdR9xxCjme4B5RnLVKS/2yadoz7n3x0a4d4MU0YBe', 'student', 10012),
(19, '$2y$10$SP7/8BConXexlHg7K./pNuQWByhk/A4/bXel8E4aeCrd5DBB7QRI6', 'student', 10013),
(20, '$2y$10$0NUdB9b1ybRVnJbLxmpZde1G3XzoNtaWu3avmk5FjsgFC9N2x0qq.', 'student', 10014),
(21, '$2y$10$ASzhyHhZAGJOQGiTuuUVX.d7JHrQThdDPWq1NhtsrbPpBFGX2VkN6', 'student', 10015),
(22, '$2y$10$4try92gXdC6/JC46tDOexupHHlaXwYPkmUsJFTgEt/aY4rZRPaffW', 'student', 10016),
(23, '$2y$10$gNc4etLTH3QWXMqExIM/6ectRy/jAVETxjS2RPcoHgYqpb147qT3W', 'student', 10017),
(24, '$2y$10$O83pHAxZhGTyKJ1i2IGezukn6O5kRH6UbOFpg3tR/NnY0m43xa8rC', 'student', 10018),
(25, '$2y$10$S1687GES3/r67v.45GD/c.MVr9cJEu4j0IecYD1tsSmwKFknA911S', 'student', 10019),
(26, '$2y$10$IfbWc9h7ByI9uvlVqDkVGOgdMHxhvUoVtHn8qRJ5YrMCbwTKbVKQW', 'student', 10020),
(27, '$2y$10$avN14yKbM/0SNjx8TD7Yw.GyuzFO.eNdT4s1h/.AD1Uswh1bL290O', 'student', 10021),
(28, '$2y$10$AFBBGfbTmsBk8ZQZ23OaN.GfmmWnAaxk/DHzejfsvRjQAHDRhC53C', 'student', 10022),
(29, '$2y$10$HEBQpQhN9yC8z.eCAUDwkubKqZBNgXxcXpnIGNBxeAfSFInZ8hI6a', 'student', 10023),
(30, '$2y$10$43o6PLiXLWvI6149rLVfcuXor28.zanBw4sZUSL2w0Qp3S8WS9gZq', 'student', 10024),
(31, '$2y$10$0IEY/SP5TZOk47JetkStwuAu6w4zbbKpltzVr6IwRO24Q.1d8nL8O', 'student', 10025),
(32, '$2y$10$77Bo.pu50Gmwq.EaK1TnMeCK.vocPwJ0Wy6ID8YKGVCbmyMmXzzGK', 'student', 10026),
(33, '$2y$10$.fTBGoT1B0EYMQpIXyYzl.vBu6564GA.VUmoFx5HmdX3R7KcQOUuW', 'student', 10027),
(34, '$2y$10$hTm/sDX2byBcNGVKr2fiIe1/KC/uHrEJdgOo7WXMK/yknZimyZCAC', 'student', 10028),
(35, '$2y$10$TmWxkn4Z6HbOuV8NDCPoJuKT3Pu2QnjNeTuNDEl4YOVNk86w0tNnK', 'student', 10029),
(36, '$2y$10$5Lx7rlKVnlfX13h85thF/uTqXD7hZ0/wCi2z19LpFsQkfQKx5Z3wO', 'student', 10030),
(37, '$2y$10$.yi1VduXAfPteRnh5K67MOyJlbIptth85qmkyxASgoMG2W99P2w7e', 'student', 10031),
(38, '$2y$10$.pmy8GBcdJMz7.kvfrvJeOn3y2uBZ1/ws6cPqqsFcV1qKv0Uvs7zi', 'student', 10032),
(39, '$2y$10$sDZBx0KuKA90YLHQAf6G6uXnH5D76mznM72vP9uIvwg4iXoPbq7Pq', 'student', 10033),
(40, '$2y$10$jJ79JK5fErSGl.zFXBIpde95r/6HBeePs0x3B9aAGvu4Fueu2z9Uy', 'student', 10034),
(41, '$2y$10$bR7sCtxTkFMGRJqjK9ZJ1OKm9VXvGLfPYvhlCitWNtw.GchJLAAJq', 'student', 10035),
(42, '$2y$10$k/izV14FlwEZtkb/SS9TO.l3IAXSZz14cfhyxjJHNE.9Ppw/o90RC', 'student', 10036),
(43, '$2y$10$FF.4MA74mO8o6IHSEUBdbuum/ybalF1vBeQ3JtfX8EmRt87e6o.mK', 'student', 10037),
(44, '$2y$10$kzUPrOVTtQhltBwduYotdOT5xWkACVAyUwk/GJ8.4a4eEKMGLniVu', 'student', 10038),
(45, '$2y$10$FEr0TV7AjZgX1oIw3e9IEuLJ7K6MaOYh8DBQQ5fEILXvnn3oZSsoG', 'student', 10039),
(46, '$2y$10$LN3WIObBsTbDzwIq3OQbVu5bTcqNdbalxXkr37KXTTkCMPnD1rwpa', 'student', 10040),
(47, '$2y$10$7FYb/1.Z4YYuuu4tOiwCweO..50NzFNdu/eRwWDAzrrPe0vbxb5lm', 'student', 10041),
(48, '$2y$10$GjDTfaeSjqh8H4D2KLxk5e5NS5Nh3gU41AIX/50r08T1xhR9borxu', 'student', 10042),
(49, '$2y$10$hxw9VgIlEr6vmnxZKhC/zuTbTsm.ArLM61VqMtqWPln7rJuabikeG', 'student', 10043),
(50, '$2y$10$UXKS6SEGMuA3eSVMNZ78nOfLu9QC.CFWWJnTyQWuX42PnGXlbMjZG', 'student', 10044),
(51, '$2y$10$HJ3eWke1wfUYPFXWhLgyu.5rHiZ.HcTE5VYTZ09MmPMakRgho10Ae', 'student', 10045),
(52, '$2y$10$cgshNNy7/RLPtQcD9yE0je0H6Z9kA4mQnhiAXh7SvmOIJGDlgMOyC', 'student', 10046),
(53, '$2y$10$i.s3cbLq6lFmjKl72KK7L.5w3Mw/6KwucvmEsAz1Ducb1dW0s.OJ.', 'student', 10047),
(54, '$2y$10$1PatgU0WquCXs96dP8rSU.vfKfYH1gVg1NbwPgqzPScGr7kRIO17W', 'student', 10048),
(55, '$2y$10$z6a76kGXZOUELlx0wsj9sOqOySCYhrFL3Xt3FmvR11CTY/DWkXcG6', 'student', 10049),
(56, '$2y$10$smm3tB6OTasKHJPfnEfx8uxbJeV6yWF6IftOm5lGz50BEYs3Lsv.u', 'student', 10050),
(57, '$2y$10$EQo7l1mG7aIE4Urd9zqf6eFWvlgEG3h5xs6DX9/zVuOlVvINU7/QW', 'student', 10051),
(58, '$2y$10$J12Z/e4/9VAYCvgIMYmlteBBhbl1huJYYmFlu5p1GKuAVv7f7gsSm', 'student', 10052),
(59, '$2y$10$pcbKQQo42FmDbNUTAH37EeQkD1lpFgFFX6XRrnN8yloiGVr.yBuHS', 'student', 20220721155403),
(60, '$2y$10$7bvYsDRM3tbPpF1.Ulm/keCEgvFUAaN0akusdAOTaIN22tOOsx4Ri', 'student', 202208244590),
(61, '$2y$10$uAJclzodfnEbxKqEzxdpz.Mcbeo6q1Vf2WxOo55X637AyZjwIOdFK', 'student', 20220824100110),
(62, '$2y$10$WPQzF.gbYzgrB7T6tECAE.Mq1d5.k36.wd/mkwC92qKLEkQ80mGE.', 'student', 20220725125037),
(63, '$2y$10$aDydpRF4pdGzkft2nYVfIOrJDOv/z46MWSTm5LHHOPSDiSIXSnShS', 'student', 20220725112458),
(64, '$2y$10$QjdF6Ly5jJ4Qv58iiwhLcec/fiZzl3T2uqo4uGDz0jCBYYJQgkwXO', 'student', 20220727113410),
(65, '$2y$10$j/z8/sU8UYiffCwpf.xR/un0w57TItH5hKORmG.RvGxu.2c3CMG16', 'student', 2021072305937),
(66, '$2y$10$gmH1Hr2/zBP5V5pMobja0eapx/9n9jQSUGbKh.kFOcHucJMsu64hW', 'student', 20230905132734);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `FK_user_TO_admin` (`user_id`);

--
-- Indexes for table `archive_history`
--
ALTER TABLE `archive_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `idx_student_id` (`student_id`),
  ADD KEY `idx_action_date` (`action_date`),
  ADD KEY `idx_action` (`action`);

--
-- Indexes for table `attendance_report`
--
ALTER TABLE `attendance_report`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `FK_student_TO_attendance` (`student_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `idx_event_date` (`event_date`),
  ADD KEY `idx_event_type` (`event_type`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`adviser_id`);

--
-- Indexes for table `secret_question`
--
ALTER TABLE `secret_question`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `FK_user_TO_student` (`user_id`);

--
-- Indexes for table `student_archive`
--
ALTER TABLE `student_archive`
  ADD PRIMARY KEY (`archive_id`),
  ADD UNIQUE KEY `unique_student_archive` (`student_id`),
  ADD KEY `idx_archived_date` (`archived_date`),
  ADD KEY `idx_is_archived` (`is_archived`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `archive_history`
--
ALTER TABLE `archive_history`
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `attendance_report`
--
ALTER TABLE `attendance_report`
  MODIFY `attendance_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=281;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `student_archive`
--
ALTER TABLE `student_archive`
  MODIFY `archive_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `FK_user_TO_admin` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `archive_history`
--
ALTER TABLE `archive_history`
  ADD CONSTRAINT `FK_student_TO_history` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attendance_report`
--
ALTER TABLE `attendance_report`
  ADD CONSTRAINT `FK_student_TO_attendance` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `FK_user_TO_instructor` FOREIGN KEY (`adviser_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `secret_question`
--
ALTER TABLE `secret_question`
  ADD CONSTRAINT `FK_user_TO_secret_question` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `FK_user_TO_student` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_archive`
--
ALTER TABLE `student_archive`
  ADD CONSTRAINT `FK_student_TO_archive` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

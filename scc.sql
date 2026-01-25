-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 10, 2026 at 10:12 AM
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
(24, 10003, 'restore', '2025-11-25 07:37:59', 'Admin', NULL, 'Restored from archive'),
(25, 20220721155403, 'archive', '2025-11-25 08:16:12', 'Admin', 'Manual archive', 'Archived from student management'),
(26, 20220721155403, 'restore', '2025-11-25 08:17:14', 'Admin', NULL, 'Restored from archive'),
(27, 20220721155403, 'archive', '2025-11-25 12:31:55', 'Admin', 'Manual archive', 'Archived from student management'),
(28, 20220721155403, 'restore', '2025-11-25 12:32:56', 'Admin', NULL, 'Restored from archive'),
(29, 20220721155403, 'archive', '2025-11-25 12:33:31', 'Admin', 'Manual archive', 'Archived from student management'),
(30, 20220721155403, 'restore', '2025-11-25 13:16:11', 'Admin', NULL, 'Restored from archive'),
(31, 20220721155403, 'archive', '2025-11-26 12:22:24', 'Admin', 'Manual archive', 'Archived from student management'),
(32, 20220721155403, 'restore', '2025-11-26 12:25:12', 'Admin', NULL, 'Restored from archive'),
(33, 20220721155403, 'archive', '2025-11-26 15:14:20', 'Admin', 'Manual archive', 'Archived from student management'),
(34, 20220721155403, 'restore', '2025-11-26 15:14:35', 'Admin', NULL, 'Restored from archive'),
(35, 20220721155403, 'archive', '2025-11-26 17:24:16', 'Admin', 'Manual archive', 'Archived from student management'),
(36, 20220721155403, 'restore', '2025-11-26 17:24:35', 'Admin', NULL, 'Restored from archive'),
(37, 10003, 'archive', '2025-12-03 21:40:35', 'Admin', 'Manual archive', 'Archived from student management'),
(38, 10003, 'restore', '2025-12-03 21:40:54', 'Admin', NULL, 'Restored from archive'),
(39, 10007, 'archive', '2025-12-04 13:46:49', 'Admin', 'Manual archive', 'Archived from student management'),
(40, 10007, 'restore', '2025-12-04 13:47:05', 'Admin', NULL, 'Restored from archive');

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
(556, 20220721155403, 'BASKETBALL', '2025-11-26 12:49:30', '12:49:00', '12:49:00', 'present'),
(563, 20220721155403, 'SCC X-MAS PARTY', '2025-11-26 17:21:45', '17:21:00', '17:23:00', 'present'),
(564, 10003, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(565, 10004, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(566, 10005, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(567, 10006, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(568, 10007, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(569, 10008, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(570, 10009, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(571, 10010, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(572, 10011, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(573, 10012, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(574, 10013, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(575, 10014, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(576, 10015, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(577, 10016, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(578, 10017, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(579, 10018, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(580, 10019, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(581, 10020, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(582, 10021, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(583, 10022, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(584, 10023, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(585, 10024, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(586, 10025, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(587, 10026, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(588, 10027, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(589, 10028, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(590, 10029, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(591, 10030, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(592, 10031, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(593, 10032, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(594, 10033, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(595, 10034, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(596, 10035, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(597, 10036, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(598, 10037, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(599, 10038, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(600, 10039, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(601, 10040, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(602, 10041, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(603, 10042, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(604, 10043, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(605, 10044, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(606, 10045, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(607, 10046, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(608, 10047, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(609, 10048, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(610, 10049, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(611, 10050, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(612, 10051, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(613, 10052, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(614, 202208244590, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(615, 20220824100110, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(616, 20220725125037, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(617, 20220725112458, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(618, 20220727113410, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(619, 9, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', '00:00:00', NULL, 'absent'),
(620, 10003, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(621, 10004, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(622, 10005, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(623, 10006, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(624, 10007, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(625, 10008, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(626, 10009, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(627, 10010, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(628, 10011, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(629, 10012, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(630, 10013, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(631, 10014, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(632, 10015, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(633, 10016, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(634, 10017, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(635, 10018, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(636, 10019, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(637, 10020, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(638, 10021, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(639, 10022, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(640, 10023, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(641, 10024, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(642, 10025, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(643, 10026, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(644, 10027, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(645, 10028, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(646, 10029, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(647, 10030, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(648, 10031, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(649, 10032, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(650, 10033, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(651, 10034, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(652, 10035, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(653, 10036, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(654, 10037, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(655, 10038, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(656, 10039, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(657, 10040, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(658, 10041, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(659, 10042, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(660, 10043, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(661, 10044, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(662, 10045, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(663, 10046, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(664, 10047, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(665, 10048, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(666, 10049, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(667, 10050, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(668, 10051, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(669, 10052, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(670, 20220721155403, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(671, 202208244590, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(672, 20220824100110, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(673, 20220725125037, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(674, 20220725112458, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(675, 20220727113410, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(676, 9, 'X-MAX PARTY', '2025-11-30 11:46:00', '00:00:00', NULL, 'absent'),
(678, 10004, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(679, 10005, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(680, 10006, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(681, 10007, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(682, 10008, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(683, 10009, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(684, 10010, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(685, 10011, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(686, 10012, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(687, 10013, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(688, 10014, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(689, 10015, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(690, 10016, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(691, 10017, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(692, 10018, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(693, 10019, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(694, 10020, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(695, 10021, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(696, 10022, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(697, 10023, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(698, 10024, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(699, 10025, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(700, 10026, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(701, 10027, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(702, 10028, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(703, 10029, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(704, 10030, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(705, 10031, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(706, 10032, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(707, 10033, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(708, 10034, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(709, 10035, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(710, 10036, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(711, 10037, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(712, 10038, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(713, 10039, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(714, 10040, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(715, 10041, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(716, 10042, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(717, 10043, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(718, 10044, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(719, 10045, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(720, 10046, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(721, 10047, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(722, 10048, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(723, 10049, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(724, 10050, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(725, 10051, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(726, 10052, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(727, 20220721155403, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(728, 202208244590, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(730, 20220725125037, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(731, 20220725112458, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(732, 20220727113410, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(733, 9, 'Intramurals day 2', '2025-12-03 21:39:00', '00:00:00', NULL, 'absent'),
(797, 10003, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(798, 10004, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(799, 10005, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(800, 10006, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(801, 10007, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(802, 10008, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(803, 10009, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(804, 10010, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(805, 10011, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(806, 10012, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(807, 10013, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(808, 10014, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(809, 10015, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(810, 10016, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(811, 10017, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(812, 10018, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(813, 10019, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(814, 10020, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(815, 10021, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(816, 10022, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(817, 10023, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(818, 10024, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(819, 10025, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(820, 10026, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(821, 10027, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(822, 10028, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(823, 10029, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(824, 10030, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(825, 10031, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(826, 10032, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(827, 10033, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(828, 10034, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(829, 10035, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(830, 10036, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(831, 10037, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(832, 10038, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(833, 10039, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(834, 10040, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(835, 10041, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(836, 10042, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(837, 10043, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(838, 10044, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(839, 10045, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(840, 10046, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(841, 10047, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(842, 10048, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(843, 10049, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(844, 10050, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(845, 10051, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(846, 10052, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(847, 20220721155403, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(848, 202208244590, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(849, 20220824100110, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(850, 20220725125037, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(851, 20220725112458, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(852, 20220727113410, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(853, 9, 'Seminar', '2025-12-03 08:45:00', '00:00:00', NULL, 'absent'),
(854, 20220824100110, 'Intramurals day 2', '2025-12-03 21:39:00', '21:39:00', '23:30:00', 'present'),
(855, 10003, 'Intramurals day 2', '2025-12-03 21:39:00', '21:39:00', '23:30:00', 'present'),
(856, 20220721155403, 'STUDENT ASSEMBLY 2025', '2025-12-04 15:39:07', '15:39:00', '15:40:00', 'present'),
(857, 10003, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(858, 10004, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(859, 10005, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(860, 10006, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(861, 10007, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(862, 10008, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(863, 10009, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(864, 10010, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(865, 10011, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(866, 10012, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(867, 10013, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(868, 10014, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(869, 10015, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(870, 10016, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(871, 10017, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(872, 10018, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(873, 10019, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(874, 10020, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(875, 10021, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(876, 10022, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(877, 10023, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(878, 10024, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(879, 10025, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(880, 10026, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(881, 10027, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(882, 10028, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(883, 10029, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(884, 10030, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(885, 10031, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(886, 10032, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(887, 10033, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(888, 10034, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(889, 10035, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(890, 10036, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(891, 10037, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(892, 10038, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(893, 10039, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(894, 10040, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(895, 10041, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(896, 10042, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(897, 10043, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(898, 10044, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(899, 10045, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(900, 10046, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(901, 10047, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(902, 10048, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(903, 10049, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(904, 10050, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(905, 10051, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(906, 10052, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(907, 20220721155403, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(908, 202208244590, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(909, 20220824100110, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(910, 20220725125037, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(911, 20220725112458, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(912, 20220727113410, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(913, 9, 'seminar day 1', '2025-12-04 13:09:00', '00:00:00', NULL, 'absent'),
(914, 10003, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(915, 10004, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(916, 10005, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(917, 10006, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(918, 10007, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(919, 10008, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(920, 10009, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(921, 10010, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(922, 10011, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(923, 10012, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(924, 10013, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(925, 10014, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(926, 10015, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(927, 10016, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(928, 10017, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(929, 10018, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(930, 10019, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(931, 10020, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(932, 10021, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(933, 10022, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(934, 10023, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(935, 10024, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(936, 10025, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(937, 10026, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(938, 10027, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(939, 10028, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(940, 10029, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(941, 10030, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(942, 10031, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(943, 10032, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(944, 10033, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(945, 10034, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(946, 10035, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(947, 10036, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(948, 10037, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(949, 10038, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(950, 10039, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(951, 10040, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(952, 10041, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(953, 10042, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(954, 10043, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(955, 10044, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(956, 10045, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(957, 10046, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(958, 10047, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(959, 10048, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(960, 10049, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(961, 10050, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(962, 10051, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(963, 10052, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(964, 202208244590, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(965, 20220824100110, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(966, 20220725125037, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(967, 20220725112458, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(968, 20220727113410, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(969, 9, 'Student Assembly 2025', '2025-12-04 15:15:00', '00:00:00', NULL, 'absent'),
(970, 10003, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(971, 10004, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(972, 10005, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(973, 10006, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(974, 10007, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(975, 10008, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(976, 10009, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(977, 10010, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(978, 10011, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(979, 10012, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(980, 10013, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(981, 10014, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(982, 10015, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(983, 10016, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(984, 10017, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(985, 10018, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(986, 10019, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(987, 10020, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(988, 10021, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(989, 10022, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(990, 10023, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(991, 10024, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(992, 10025, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(993, 10026, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(994, 10027, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(995, 10028, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(996, 10029, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(997, 10030, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(998, 10031, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(999, 10032, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1000, 10033, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1001, 10034, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1002, 10035, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1003, 10036, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1004, 10037, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1005, 10038, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1006, 10039, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1007, 10040, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1008, 10041, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1009, 10042, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1010, 10043, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1011, 10044, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1012, 10045, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1013, 10046, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1014, 10047, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1015, 10048, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1016, 10049, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1017, 10050, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1018, 10051, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1019, 10052, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1020, 20220721155403, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1021, 202208244590, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1022, 20220824100110, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1023, 20220725125037, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1024, 20220725112458, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1025, 20220727113410, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1026, 9, 'IT Seminar', '2025-12-04 18:12:00', '00:00:00', NULL, 'absent'),
(1084, 20220721155403, 'SEMINAR FOR DRUG AWARENESS', '2026-01-09 14:06:10', '14:06:00', NULL, 'late'),
(1085, 10003, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1086, 10004, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1087, 10005, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1088, 10006, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1089, 10007, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1090, 10008, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1091, 10009, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1092, 10010, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1093, 10011, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1094, 10012, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1095, 10013, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1096, 10014, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1097, 10015, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1098, 10016, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1099, 10017, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1100, 10018, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1101, 10019, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1102, 10020, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1103, 10021, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1104, 10022, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1105, 10023, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1106, 10024, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1107, 10025, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1108, 10026, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1109, 10027, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1110, 10028, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1111, 10029, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1112, 10030, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1113, 10031, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1114, 10032, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1115, 10033, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1116, 10034, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1117, 10035, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1118, 10036, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1119, 10037, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1120, 10038, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1121, 10039, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1122, 10040, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1123, 10041, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1124, 10042, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1125, 10043, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1126, 10044, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1127, 10045, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1128, 10046, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1129, 10047, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1130, 10048, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1131, 10049, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1132, 10050, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1133, 10051, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1134, 10052, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1135, 202208244590, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1136, 20220824100110, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1137, 20220725125037, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1138, 20220725112458, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1139, 20220727113410, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent'),
(1140, 9, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', '00:00:00', NULL, 'absent');

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
(6, 'SCC X-MAS PARTY', '2025-11-26 17:20:00', 'All Year Level', 'test', 'SIBONGA-SCC X-MAS PARTY-5:20:00 PM', '2025-11-26 09:20:42', 'Active'),
(7, 'X-MAX PARTY', '2025-11-30 11:46:00', 'All Year Level', 'TEST', 'SIBONGA-X-MAX PARTY-11:46:00 AM', '2025-11-30 03:46:48', 'Active'),
(8, 'Intramurals day 2', '2025-12-03 21:39:00', 'All Year Level', 'test', 'SIBONGA-INTRAMURALS DAY 2-9:39:00 PM', '2025-12-03 13:39:14', 'Active'),
(11, 'Seminar', '2025-12-03 08:45:00', 'All Year Level', 'test', 'SIBONGA-SEMINAR-8:45:00 AM', '2025-12-04 04:45:48', 'Active'),
(12, 'seminar day 1', '2025-12-04 13:09:00', 'All Year Level', 'test', 'SIBONGA-SEMINAR DAY 1-1:09:00 PM', '2025-12-04 07:09:48', 'Active'),
(13, 'IT Seminar', '2025-12-04 18:12:00', 'All Year Level', 'test', 'SIBONGA-IT SEMINAR-6:12:00 PM', '2025-12-04 07:12:54', 'Active'),
(14, 'Student Assembly 2025', '2025-12-04 15:15:00', 'All Year Level', 'test', 'SIBONGA-STUDENT ASSEMBLY 2025-3:15:00 PM', '2025-12-04 07:15:41', 'Active'),
(15, 'Seminar for Drug Awareness', '2026-01-09 13:00:00', 'All Year Level', 'test', 'SIBONGA-SEMINAR FOR DRUG AWARENESS-1:00:00 PM', '2026-01-09 05:54:46', 'Active');

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
(6, 'Javan Alexandre', 'A', 'Juario', 'All Year Level', 'BS Information Technology', 'Department Head'),
(69, 'Maria', 'A', 'De los Santos', '1st Year', 'BS Information Technology', 'Instructor'),
(72, 'Winaflor', 'A.', 'Ratunil', '2nd Year', 'BS Information Technology', 'Instructor');

-- --------------------------------------------------------

--
-- Table structure for table `instructor_sets`
--

CREATE TABLE `instructor_sets` (
  `assignment_id` int NOT NULL,
  `adviser_id` int NOT NULL,
  `set_name` enum('Set A','Set B','Set C','Set D') NOT NULL,
  `assigned_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `instructor_sets`
--

INSERT INTO `instructor_sets` (`assignment_id`, `adviser_id`, `set_name`, `assigned_date`) VALUES
(7, 72, 'Set A', '2026-01-10 10:07:01'),
(8, 72, 'Set C', '2026-01-10 10:07:01'),
(9, 72, 'Set D', '2026-01-10 10:07:01');

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
(64, 'What is your mother\\\'s maiden name?', 'What was your childhood nickname?', 'What is your father\\\'s middle name?', 'What is your favorite subject?', 'What is your dream destination?', '$2y$10$/IRAtVMLWsWZw67pp17uCONklGyFtLlb4B19oFT0PlD2NGUaTrKQG', '$2y$10$fuzEUenuzjwUKchANovWjOIoy6qccEuLnaNBIssl454Q5lSZqqJKW', '$2y$10$fpnMh2ahnr6jwbWwEQMOdO3iVtg5ul0xCSHfHk4geNAdEXLc1/PDi', '$2y$10$rdprwNJolsFNqGt/7nxVB.GiHytSebqfDgg4vVia0ogpJHAFcXSrW', '$2y$10$qWZ6lAws3sj1pMXs0bKQYu2j/P1JOdssPFc.qYK6fWRdggBh1p6S6'),
(67, 'What is your mother\\\'s maiden name?', 'What is your favorite food?', 'What is your favorite movie?', 'What was your first job?', 'What is your dream destination?', '$2y$10$Qkz/6QCaa2Mgq8N3FzKSMeO4vFBUOHNiCWNwL7WDpWUHslCKKBvym', '$2y$10$7kHkCy2d0pliejDAlJz7OeQy6u.8dQM/u90B03MQiQqVEqv5rlNtm', '$2y$10$p1nq9Wf5GzniT2GklcVNRuTQ3/oR3kV4W8FL6SDAagztQ020/DtB2', '$2y$10$V2SKX5ecgdMdKGpBcOMc4u9OVdJwO49hihY3EiHrZeG2.vgMbc4E2', '$2y$10$l3W2oYwMOv.S1oOPVsJznuNc7/LbOZiNwYrxPg7YBZ12M3XH6BY/O'),
(69, 'What is your mother\'s maiden name?', 'What is the name of your favorite teacher?', 'What is your father\'s middle name?', 'What is your favorite sport?', 'What is your favorite band or artist?', '$2y$10$ZdYbQ9tzNWp.HhJp3/R9U.dER9xHvy2fj8y8nDR4B5pBL5kU2FDK.', '$2y$10$bf3kwqsKUduqwBJ.mN2Sou0.vNPkH5Z75IQ6gEnj/xP9VG.0Rt8wa', '$2y$10$5y5L5ifYZIsTFjmKe21Er.bBDEDPcMXFZvRQVsUzqzZ9Mzn8epOBq', '$2y$10$nRArqzZ1m1fTZs.GNsjJpO.QvhSiaLFO.iOgDXUtST9PN6ejL9sOm', '$2y$10$mJViwW4zMo7fM0ZNxmVCvu9/5tgxKQoeFtLZnAzRVMbBCTBFFXKJq'),
(72, 'What is your favorite color?', 'What is your favorite food?', 'What is your father\'s middle name?', 'What is your favorite sport?', 'What is your best friend\'s name?', '$2y$10$mxsHi4hkQPwo7MmjGgeJmOzsdfJ85Gj4AU3fc6qVx7Z8F2Re0aVWu', '$2y$10$FHafYkuBL7FzYnrcE7Gon.VO0/NILZPIulNNwEgNTxG68YUQ1vEvq', '$2y$10$tHS.09TZ4YkRkTs2wfpt4eRhqVpOHds/tu0T2xPfJeuUNiPLcryr2', '$2y$10$s/Zw7za6XN6GjLnAyFvoSOnDVSq.8cmcCBd/1XfyOlx7bduz7fmGS', '$2y$10$xB4yIy4T6VbVk4ginvgnr.Z/MSJ5H3TM1HVMjzCrleup12p9qlUDm');

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
(67, 9, 'sonic', 'A.', 'pastor', '1st Year', 'Male', 'Set A', 'BS Secondary Education'),
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
(59, 20220721155403, 'Rysian Denver', 'O', 'Bulala', '4th Year', 'Not Specified', 'Set C', 'BS Information Technology'),
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
(1, 10003, '2025-12-03 21:40:35', 'Manual archive', 'Admin', 0, '2025-12-03 21:40:54', 'Admin', 'Archived from student management'),
(3, 10004, '2025-11-24 08:34:16', 'Manual archive', 'Admin', 0, '2025-11-24 08:43:52', 'Admin', 'Archived from student management'),
(4, 10005, '2025-11-24 08:43:24', 'Manual archive', 'Admin', 0, '2025-11-24 08:43:45', 'Admin', 'Archived from student management'),
(9, 20220721155403, '2025-11-26 17:24:16', 'Manual archive', 'Admin', 0, '2025-11-26 17:24:35', 'Admin', 'Archived from student management'),
(20, 10007, '2025-12-04 13:46:49', 'Manual archive', 'Admin', 0, '2025-12-04 13:47:05', 'Admin', 'Archived from student management');

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
(7, '$2y$10$KUnDNL23y8DdKdRFziuBKeBinKpCLP5mNsycZMus9DV3KDBQkZqg2', 'admin', 98),
(8, '$2y$10$ekk.4jh/rtPRXbd1CUpFneKuGj9HZudXAgJBRX3qMZ7hwb74KksKq', 'admin', 456),
(9, '$2y$10$MdmfTD6mH/tFZnrbgJuIkOZX7fy5HsYfgtPXfPpM69lZaOHkGJq2.', 'student', 10003),
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
(66, '$2y$10$gmH1Hr2/zBP5V5pMobja0eapx/9n9jQSUGbKh.kFOcHucJMsu64hW', 'student', 20230905132734),
(67, '$2y$10$xZNzqap6YGk8bNtCs.Vh9e5grVPTUhNbRzDvpKDRz80ElHjZ3bRN6', 'student', 9),
(68, '$2y$10$KNxDX28Oi0nzxuhvhotQ9.65B0..76rUUGFYKlLAJJPv32KMILY62', 'student', 21),
(69, '$2y$10$NsGtkmk0vazUSUCRe1929.vvMh1DZ5oSj7/pnrzB9dtMv/s3/2Zme', 'instructor', 143),
(70, '$2y$10$iveIE1BgTYaRavY17h7DEOQT4pPML3E0ypGLDk4lze27uvWGhW/a.', 'instructor', 369),
(71, '$2y$10$6QLmM/.GNM.Pn2o/DQVs8Op1bDGjlzcpfdWZ0LKsCd5x3.EAFU3tW', 'student', 69),
(72, '$2y$10$cyOT6N7slUdyHMEE6KQp/ubrcZWnDcKt4ybxWWpiXCkNrQowz5b7W', 'instructor', 10);

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
-- Indexes for table `instructor_sets`
--
ALTER TABLE `instructor_sets`
  ADD PRIMARY KEY (`assignment_id`),
  ADD UNIQUE KEY `unique_instructor_set` (`adviser_id`,`set_name`),
  ADD KEY `idx_adviser_id` (`adviser_id`),
  ADD KEY `idx_set_name` (`set_name`);

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
  MODIFY `history_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `attendance_report`
--
ALTER TABLE `attendance_report`
  MODIFY `attendance_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1141;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `event_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `instructor_sets`
--
ALTER TABLE `instructor_sets`
  MODIFY `assignment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `student_archive`
--
ALTER TABLE `student_archive`
  MODIFY `archive_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

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
-- Constraints for table `instructor_sets`
--
ALTER TABLE `instructor_sets`
  ADD CONSTRAINT `FK_instructor_TO_sets` FOREIGN KEY (`adviser_id`) REFERENCES `instructor` (`adviser_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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

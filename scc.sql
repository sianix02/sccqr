-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 25, 2025 at 01:59 AM
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
-- Table structure for table `attendance_report`
--

CREATE TABLE `attendance_report` (
  `attendance_id` int NOT NULL,
  `student_id` bigint NOT NULL,
  `event_name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time_in` time NOT NULL,
  `time_out` time DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance_report`
--

INSERT INTO `attendance_report` (`attendance_id`, `student_id`, `event_name`, `date`, `time_in`, `time_out`, `remarks`) VALUES
(12, 10003, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(13, 10003, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(14, 10003, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(15, 10003, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(16, 10003, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(17, 10004, 'SCC NIGHT', '2025-09-15', '18:15:00', '21:30:00', 'present'),
(18, 10004, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(19, 10004, 'SPORTS FEST', '2025-09-25', '07:45:00', '17:00:00', 'present'),
(20, 10004, 'CAREER SUMMIT', '2025-10-01', '09:20:00', '16:00:00', 'late'),
(21, 10004, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(22, 10005, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(23, 10005, 'ORIENTATION DAY', '2025-08-20', '08:10:00', '12:00:00', 'present'),
(24, 10005, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(25, 10005, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(26, 10005, 'GRADUATION BALL', '2025-10-10', '19:30:00', '23:00:00', 'late'),
(27, 10006, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(28, 10006, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(29, 10006, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(30, 10006, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(31, 10006, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(32, 10007, 'SCC NIGHT', '2025-09-15', '18:20:00', '21:30:00', 'late'),
(33, 10007, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(34, 10007, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(35, 10007, 'CAREER SUMMIT', '2025-10-01', '09:15:00', '16:00:00', 'present'),
(36, 10007, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(37, 10008, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(38, 10008, 'ORIENTATION DAY', '2025-08-20', '08:05:00', '12:00:00', 'late'),
(39, 10008, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(40, 10008, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(41, 10008, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(42, 10009, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(43, 10009, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(44, 10009, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(45, 10009, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(46, 10009, 'GRADUATION BALL', '2025-10-10', '19:10:00', '23:00:00', 'late'),
(47, 10010, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(48, 10010, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(49, 10010, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(50, 10010, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(51, 10010, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(52, 10011, 'SCC NIGHT', '2025-09-15', '18:25:00', '21:30:00', 'late'),
(53, 10011, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(54, 10011, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(55, 10011, 'CAREER SUMMIT', '2025-10-01', '09:10:00', '16:00:00', 'present'),
(56, 10011, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(57, 10012, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(58, 10012, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(59, 10012, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(60, 10012, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(61, 10012, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(62, 10013, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(63, 10013, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(64, 10013, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(65, 10013, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(66, 10013, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(67, 10014, 'SCC NIGHT', '2025-09-15', '18:10:00', '21:30:00', 'present'),
(68, 10014, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(69, 10014, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(70, 10014, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(71, 10014, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(72, 10015, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(73, 10015, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(74, 10015, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(75, 10015, 'CAREER SUMMIT', '2025-10-01', '09:05:00', '16:00:00', 'absent'),
(76, 10015, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(77, 10016, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(78, 10016, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(79, 10016, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(80, 10016, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(81, 10016, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(82, 10017, 'SCC NIGHT', '2025-09-15', '18:30:00', '21:30:00', 'late'),
(83, 10017, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(84, 10017, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(85, 10017, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(86, 10017, 'GRADUATION BALL', '2025-10-10', '19:15:00', '23:00:00', 'late'),
(87, 10018, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(88, 10018, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(89, 10018, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(90, 10018, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(91, 10018, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(92, 10019, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(93, 10019, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(94, 10019, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(95, 10019, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(96, 10019, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(97, 10020, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(98, 10020, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(99, 10020, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(100, 10020, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(101, 10020, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(102, 10021, 'SCC NIGHT', '2025-09-15', '18:20:00', '21:30:00', 'absent'),
(103, 10021, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(104, 10021, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(105, 10021, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(106, 10021, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(107, 10022, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(108, 10022, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(109, 10022, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(110, 10022, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(111, 10022, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(112, 10023, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(113, 10023, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(114, 10023, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(115, 10023, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(116, 10023, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(117, 10024, 'SCC NIGHT', '2025-09-15', '18:05:00', '21:30:00', 'absent'),
(118, 10024, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(119, 10024, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(120, 10024, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(121, 10024, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(122, 10025, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(123, 10025, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(124, 10025, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(125, 10025, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(126, 10025, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(127, 10026, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(128, 10026, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(129, 10026, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(130, 10026, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(131, 10026, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(132, 10027, 'SCC NIGHT', '2025-09-15', '18:15:00', '21:30:00', 'absent'),
(133, 10027, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(134, 10027, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(135, 10027, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(136, 10027, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(137, 10028, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(138, 10028, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(139, 10028, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(140, 10028, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(141, 10028, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(142, 10029, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(143, 10029, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(144, 10029, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(145, 10029, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(146, 10029, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(147, 10030, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(148, 10030, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(149, 10030, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(150, 10030, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(151, 10030, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(152, 10031, 'SCC NIGHT', '2025-09-15', '18:25:00', '21:30:00', 'late'),
(153, 10031, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(154, 10031, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(155, 10031, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(156, 10031, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(157, 10032, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(158, 10032, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(159, 10032, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(160, 10032, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(161, 10032, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(162, 10033, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(163, 10033, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(164, 10033, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(165, 10033, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(166, 10033, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(167, 10034, 'SCC NIGHT', '2025-09-15', '18:10:00', '21:30:00', 'present'),
(168, 10034, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(169, 10034, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(170, 10034, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(171, 10034, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(172, 10035, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(173, 10035, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(174, 10035, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(175, 10035, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(176, 10035, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(177, 10036, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(178, 10036, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(179, 10036, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(180, 10036, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(181, 10036, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(182, 10037, 'SCC NIGHT', '2025-09-15', '18:20:00', '21:30:00', 'late'),
(183, 10037, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(184, 10037, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(185, 10037, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(186, 10037, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(187, 10038, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(188, 10038, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(189, 10038, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(190, 10038, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(191, 10038, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(192, 10039, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(193, 10039, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(194, 10039, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(195, 10039, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(196, 10039, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(197, 10040, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(198, 10040, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(199, 10040, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(200, 10040, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(201, 10040, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(202, 10041, 'SCC NIGHT', '2025-09-15', '18:30:00', '21:30:00', 'late'),
(203, 10041, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(204, 10041, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(205, 10041, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(206, 10041, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(207, 10042, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(208, 10042, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(209, 10042, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(210, 10042, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(211, 10042, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(212, 10043, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(213, 10043, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(214, 10043, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(215, 10043, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(216, 10043, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(217, 10044, 'SCC NIGHT', '2025-09-15', '18:05:00', '21:30:00', 'present'),
(218, 10044, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(219, 10044, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(220, 10044, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(221, 10044, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(222, 10045, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(223, 10045, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(224, 10045, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(225, 10045, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(226, 10045, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(227, 10046, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(228, 10046, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(229, 10046, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(230, 10046, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(231, 10046, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(232, 10047, 'SCC NIGHT', '2025-09-15', '18:15:00', '21:30:00', 'late'),
(233, 10047, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(234, 10047, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(235, 10047, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(236, 10047, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(237, 10048, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'absent'),
(238, 10048, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(239, 10048, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(240, 10048, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(241, 10048, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(242, 10049, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'late'),
(243, 10049, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(244, 10049, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(245, 10049, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'present'),
(246, 10049, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(247, 10050, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(248, 10050, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'late'),
(249, 10050, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'absent'),
(250, 10050, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(251, 10050, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'present'),
(252, 10051, 'SCC NIGHT', '2025-09-15', '18:20:00', '21:30:00', 'absent'),
(253, 10051, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'present'),
(254, 10051, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'late'),
(255, 10051, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'absent'),
(256, 10051, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'late'),
(257, 10052, 'SCC NIGHT', '2025-09-15', '18:00:00', '21:30:00', 'present'),
(258, 10052, 'ORIENTATION DAY', '2025-08-20', '08:00:00', '12:00:00', 'absent'),
(259, 10052, 'SPORTS FEST', '2025-09-25', '07:30:00', '17:00:00', 'present'),
(260, 10052, 'CAREER SUMMIT', '2025-10-01', '09:00:00', '16:00:00', 'late'),
(261, 10052, 'GRADUATION BALL', '2025-10-10', '19:00:00', '23:00:00', 'absent'),
(262, 10004, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(263, 20220824100110, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(264, 10010, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(265, 10008, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(266, 10007, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(267, 10005, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(268, 10003, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(269, 10009, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(270, 20220721155403, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(271, 202208244590, 'GENERAL ASSEMBLY', '2025-10-05', '08:00:00', '12:00:00', 'present'),
(272, 20220725112458, 'SCC NIGHT', '2025-10-06', '10:04:00', '10:05:00', 'late'),
(273, 10003, 'SCC NIGHT', '2025-10-06', '11:13:00', '11:13:00', 'late'),
(274, 20220727113410, 'INTRAMURALS', '2025-10-06', '12:20:00', '12:21:00', 'present'),
(275, 20220721155403, 'HALLOWEEN PARTY', '2025-10-08', '15:30:00', '15:30:00', 'present');

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
(59, '$2y$10$6790bOyPU09IofXeY0lDPuvT0Lz.Basez25kNuSGxiHpNcct32Uy.', 'student', 20220721155403),
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
-- Indexes for table `attendance_report`
--
ALTER TABLE `attendance_report`
  ADD PRIMARY KEY (`attendance_id`),
  ADD KEY `FK_student_TO_attendance` (`student_id`);

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
-- AUTO_INCREMENT for table `attendance_report`
--
ALTER TABLE `attendance_report`
  MODIFY `attendance_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=276;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

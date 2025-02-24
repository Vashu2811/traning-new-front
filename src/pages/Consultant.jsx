import { Link } from "@mui/material";
import React, { useEffect, useState } from "react";
import "styles/Consultant.css";
import BluedropISMImg from "../pages/img/Bluedrop_ISM.png";
import BravantiImg from "../pages/img/Bravanti.png";
import CareerLifeAcademyImg from "../pages/img/Career-Life-Academy.png";
import CulverStocktonImg from "../pages/img/Culver_Stockton.png";
import DaltonStateImg from "../pages/img/Dalton_State.png";
import ECAImg from "../pages/img/ECA.png";
import FontbonneUniversityImg from "../pages/img/Fontbonne_University.png";
import GeorgianCollegeImg from "../pages/img/Georgian_College.png";
import ImpactGroupImg from "../pages/img/Impact_Group.png";
import KeystonePartnersImg from "../pages/img/Keystone_Partners.png";
import MohawkCollegeImg from "../pages/img/Mohawk_College.png";
import PodiumEducationImg from "../pages/img/Podium_Education.png";
import PurpleBriefcaseNewImg from "../pages/img/Purple_Briefcase_New.png";
import ReinhardtUniversityImg from "../pages/img/Reinhardt_University.png";
import SenecaCollegeImg from "../pages/img/Seneca_College.png";
import ThriveNEWImg from "../pages/img/Thrive_NEW.png";
import WebsterImg from "../pages/img/Webster.png";
import AccountantImg from "../pages/img/accountant.svg";
import AppleImg from "../pages/img/apple.svg";
import ArchitectureImg from "../pages/img/architecture.png";
import BalanceImg from "../pages/img/balance.svg";
import BankImg from "../pages/img/bank.svg";
import InterviewImg from "../pages/img/build-interview-confidence.svg";
import BuildInterviewImg from "../pages/img/build-interview.svg";
import BuiltInCameraImg from "../pages/img/built-in-camera.svg";
import CalendarImg from "../pages/img/calendar.svg";
import CapitolImg from "../pages/img/capitol.svg";
import AdvisorImg from "../pages/img/career-advisor.webp";
import DinnerImg from "../pages/img/dinner.svg";
import DnaImg from "../pages/img/dna.svg";
import EarnmoreImg from "../pages/img/earn-more.svg";
import EmployeeImg from "../pages/img/employee.svg";
import FacebookImg from "../pages/img/facebook.svg";
import FirstAidKitImg from "../pages/img/first-aid-kit.svg";
import HiredImg from "../pages/img/get-hired-faster.svg";
import GTJobGraphicImg from "../pages/img/gtJobGraphic.webp";
import GuideGraphicImg from "../pages/img/guideGraphic2-new.webp";
import BannerImg1 from "../pages/img/hmBannerImg.png";
import ImproveImg from "../pages/img/improve.svg";
import InstagramImg from "../pages/img/instagram.svg";
import InsuranceImg from "../pages/img/insurance.svg";
import InterviewsAnywhereImg from "../pages/img/interviews-anywhere.svg";
import JobImg from "../pages/img/land-the-job.svg";
import LinkedinImg from "../pages/img/linkedin.svg";
import LoveImg from "../pages/img/love.svg";
import MegaphoneImg from "../pages/img/megaphone.svg";
import NewsImg from "../pages/img/news.svg";
import PaintingImg from "../pages/img/painting.svg";
import BannerImg2 from "../pages/img/rdHmSecImg.webp";
import BannerImg4 from "../pages/img/rdHmSecThreeImg.webp";
import BannerImg3 from "../pages/img/rdHmSecTwoImg.webp";
import ResponsiveImg from "../pages/img/responsive.svg";
import SharePracticesImg from "../pages/img/share-practices.svg";
import SheriffImg from "../pages/img/sheriff.svg";
import SketchingImg from "../pages/img/sketching.svg";
import SkillsImg from "../pages/img/skills.svg";
import StudyingImg from "../pages/img/studying.svg";
import TrolleyImg from "../pages/img/trolley.svg";

const Consultant = ({ sidebarOpen }) => {
  // Sidebar Open/Close
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // Change nav color when scrolling
  const [color, setColor] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 0) {
        setColor(true);
      } else {
        setColor(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const jobTitles = [
    { name: "Accounting", img: AccountantImg, alt: "accountant-img" },
    { name: "Administrative Support", img: CalendarImg, alt: "calendar-img" },
    {
      name: "Architecture & Construction",
      img: ArchitectureImg,
      alt: "architecture-img",
    },
    { name: "Arts", img: PaintingImg, alt: "painting-img" },
    { name: "Banking & Finance", img: BankImg, alt: "bank-img" },
    { name: "Education", img: AppleImg, alt: "apple-img" },
    { name: "Engineering", img: SketchingImg, alt: "sketching-img" },
    { name: "Government & Public Admin", img: CapitolImg, alt: "capitol-img" },
    { name: "Health Science", img: FirstAidKitImg, alt: "first-aid-kit-img" },
    { name: "Hospitality & Tourism", img: DinnerImg, alt: "dinner-img" },
    { name: "Human Resources", img: EmployeeImg, alt: "employee-img" },
    { name: "Human Services", img: LoveImg, alt: "love-img" },
    {
      name: "Information Technology",
      img: ResponsiveImg,
      alt: "responsive-img",
    },
    { name: "Insurance", img: InsuranceImg, alt: "insurance-img" },
    { name: "Journalism & Broadcasting", img: NewsImg, alt: "news-img" },
    { name: "Law", img: BalanceImg, alt: "balance-img" },
    {
      img: MegaphoneImg,
      alt: "megaphone-img",
      name: "Marketing, Sales & Service",
    },
    {
      img: SheriffImg,
      alt: "sheriff-img",
      name: "Public Safety & Security",
    },
    {
      img: StudyingImg,
      alt: "studying-img",
      name: "School Admissions",
    },
    {
      img: DnaImg,
      alt: "dna-img",
      name: "Science & Mathematics",
    },
    {
      img: TrolleyImg,
      alt: "trolley-img",
      name: "Transportation, Distribution & Logistics",
    },
  ];

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-[#1A1C1E]">
          <main className="p-4">
            <div className="bg-[#1A1C1E] pt-16 pb-10 px-6 md:pt-32 md:pb-16 md:px-20 lg:px-40">
              <div className="container mx-auto px-3 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="pr-0 md:pr-16">
                    <h1 className="text-2xl md:text-3xl text-[#fdfdfd] mb-6 font-extrabold">
                      Master the interview & land a job worth loving.
                    </h1>
                    <p className="text-sm md:text-md text-[#fdfdfd] tracking-[.53px] mb-6">
                      Simulate realistic interviews for over 120 different job
                      positions and level up your skills in no time.
                    </p>
                    <Link to="#" className="custom-link">
                      Learn More
                    </Link>
                  </div>
                  <div>
                    <img
                      className="w-full h-auto"
                      src={BannerImg1}
                      alt="banner-img1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pt-16 pb-10">
                  <div>
                    <img
                      className="w-full h-auto"
                      src={BannerImg2}
                      alt="banner-img2"
                    />
                  </div>
                  <div className="pl-0 md:pl-16">
                    <h3 className="text-2xl md:text-3xl text-[#fdfdfd] mb-5 font-extrabold tracking-[-.2px]">
                      Take Mock Interviews On Your Own
                    </h3>
                    <p className="text-sm md:text-md text-[#fdfdfd] tracking-[.53px] mb-6">
                      Take unlimited interviews and master your skills from
                      anywhere. No awkward meetups required.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1A1C1E] pt-16 md:pt-28 mt-[-150px] md:mt-[-190px] px-6 md:px-20 lg:px-40">
              <div className="container mx-auto px-3 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="pr-0 md:pr-16 pl-0 md:pl-20">
                    <h3 className="text-2xl md:text-3xl text-[#fdfdfd] mb-6 font-extrabold">
                      Practice for the Pressure
                    </h3>
                    <p className="text-sm md:text-md text-[#fdfdfd] tracking-[.53px] mb-6">
                      We use your built-in camera to recreate the pressure of
                      actual interviews so you can gain realistic experience and
                      feel prepared for anything.
                    </p>
                  </div>
                  <div>
                    <img
                      className="w-full h-auto"
                      src={BannerImg3}
                      alt="banner-img3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-6">
                  <div>
                    <img
                      className="w-full h-auto"
                      src={BannerImg4}
                      alt="banner-img4"
                    />
                  </div>
                  <div className="pl-0 md:pl-16">
                    <h3 className="text-2xl md:text-3xl text-[#fdfdfd] mb-5 font-extrabold tracking-[-.2px]">
                      Review Your Recorded Responses
                    </h3>
                    <p className="text-sm md:text-md text-[#fdfdfd] tracking-[.53px] mb-6">
                      Your responses are automatically recorded, so you can
                      watch them after your interview and know exactly how you
                      came across.
                    </p>
                    <Link to="#" className="custom-link">
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-24 pt-9 w-full bg-gradient-to-b from-gray-400 to-transparent">
              <div className="container mx-auto px-3 max-w-[750px]">
                <div className="row flex relative w-full items-start justify-between">
                  <div className="grid grid-cols-2 gap-16 pb-[89px] relative w-full px-3">
                    <div>
                      <img
                        className="max-w-full h-auto align-middle"
                        src={InterviewImg}
                        alt="interview-img"
                      />
                      <h3 className="text-2xl text-[#1a1C1E] mb-5 font-extrabold">
                        Build interview confidence.
                      </h3>
                      <p className="text-sm text-[#1a1C1E] tracking-[.14px] mb-4">
                        We give you everything you need to master your interview
                        skills in less time than any other option, so you can
                        walk into your interview with confidence.
                      </p>
                    </div>
                    <div>
                      <img
                        className="max-w-full h-auto align-middle"
                        src={HiredImg}
                        alt="hired-img"
                      />
                      <h3 className="text-2xl text-[#1a1C1E] mb-5 font-extrabold">
                        Get hired faster.
                      </h3>
                      <p className="text-sm text-[#1a1C1E] tracking-[.14px] mb-4">
                        Our simulator is optimized to help you master your
                        interview skills in the most efficient way possible, so
                        you can be prepared to ace the interview in no time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="row flex relative w-full items-start justify-between">
                  <div className="grid grid-cols-2 gap-12 relative w-full px-3">
                    <div>
                      <img
                        className="max-w-full h-auto align-middle"
                        src={EarnmoreImg}
                        alt="earnmore-img"
                      />
                      <h3 className="text-2xl text-[#fdfdfd] mb-5 font-extrabold">
                        Accelerate your career & earn more.
                      </h3>
                      <p className="text-sm text-[#fdfdfd] tracking-[.14px] mb-4">
                        Master the skill of interviewing by practicing it just
                        like you practice your trade and give your career a
                        boost.
                      </p>
                    </div>
                    <div>
                      <img
                        className="max-w-full h-auto align-middle"
                        src={JobImg}
                        alt="job-img"
                      />
                      <h3 className="text-2xl text-[#fdfdfd] mb-5 font-extrabold">
                        Land the job you've been dreaming of.
                      </h3>
                      <p className="text-sm text-[#fdfdfd] tracking-[.14px] mb-4">
                        Gain realistic interview experience and master the
                        skills you need to wow your employers and beat out the
                        competition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-16 relative w-full px-6 lg:px-20 xl:px-40">
              <div className="container mx-auto px-3 w-full">
                <div className="row flex flex-wrap items-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
                    <div>
                      <video
                        id="video"
                        className="w-full h-auto object-cover bg-black"
                        playsInline
                        crossOrigin="anonymous"
                        preload="auto"
                        controls
                        poster="images/video_poster/introduction.png"
                      ></video>
                    </div>
                    <div>
                      <h3 className="text-center lg:text-left text-2xl lg:text-3xl text-[#fdfdfd] mb-5 font-extrabold">
                        Complete Online Video Course
                      </h3>
                      <p className="text-center lg:text-left text-md text-[#fdfdfd] tracking-[.14px] mb-6">
                        Become an interview expert with this series of
                        fun-to-watch lessons. We’ll teach you how to avoid
                        common pitfalls so you can ace the interview.
                      </p>
                      <div className="text-center lg:text-left">
                        <Link
                          to="#"
                          className="custom-link text-[#007bff] hover:underline"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-14 pb-16 relative w-full careerAdvisorSec px-6 lg:px-20 xl:px-40">
              <div className="container mx-auto px-3 w-full">
                <div className="row flex flex-wrap items-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full relative">
                    <div className="w-full lg:w-96">
                      <h4 className="text-center lg:text-left text-sm text-[#fdfdfd] tracking-[3.89px] uppercase mb-2">
                        For Career Advisors
                      </h4>
                      <h3 className="pt-6 text-center lg:text-left text-2xl lg:text-3xl text-[#fdfdfd] mb-5 font-extrabold tracking-[.2px]">
                        Mock Interviews They Can Take on Their Own
                      </h3>
                      <p className="text-center lg:text-left text-md text-[#fdfdfd] tracking-[.13px] mb-7">
                        Provide simulated interviews they can conduct on their
                        own. No need to schedule, commute, or meet in person.
                      </p>
                      <div className="text-center lg:text-left">
                        <Link
                          to="#"
                          className="custom-link text-[#007bff] hover:underline"
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                    <div className="block w-full lg:block">
                      <img
                        className="w-full h-auto"
                        src={AdvisorImg}
                        alt="advisor-img"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-16 w-full bg-[#1A1C1E] px-6 sm:px-12 lg:px-20 xl:px-40">
              <div className="container mx-auto max-w-[940px]">
                <div className="row flex justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-20">
                    <div className="flex flex-wrap items-center justify-center content-start text-center">
                      <img
                        className="max-w-full h-auto pb-5"
                        src={BuildInterviewImg}
                        alt="build-interview-img"
                      />
                      <h3 className="text-lg sm:text-xl lg:text-2xl text-[#fdfdfd] mb-2.5 font-extrabold">
                        Build interviews.
                      </h3>
                      <p className="text-sm text-[#fdfdfd]">
                        Using your own questions.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center content-start text-center">
                      <img
                        className="max-w-full h-auto pb-5"
                        src={SkillsImg}
                        alt="skills-img"
                      />
                      <h3 className="text-lg sm:text-xl lg:text-2xl text-[#fdfdfd] mb-2.5 font-extrabold">
                        Level up your skills.
                      </h3>
                      <p className="text-sm text-[#fdfdfd]">
                        With our exclusive interview training program.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center content-start text-center">
                      <img
                        className="max-w-full h-auto pb-5"
                        src={SharePracticesImg}
                        alt="share-practices-img"
                      />
                      <h3 className="text-lg sm:text-xl lg:text-2xl text-[#fdfdfd] mb-2.5 font-extrabold">
                        Share practices.
                      </h3>
                      <p className="text-sm text-[#fdfdfd]">
                        Get feedback from anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-[90px] w-full bg-gradient-to-t from-gray-400 to-transparent">
              <div className="container mx-auto max-w-[1320px]">
                <h3 className="text-sm text-[#fdfdfd] opacity-70 mb-10 uppercase text-center tracking-[3.5px]">
                  Our Partners
                </h3>

                <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-20">
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={PurpleBriefcaseNewImg}
                      alt="Purple Briefcase"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={ThriveNEWImg}
                      alt="Thrive"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={CareerLifeAcademyImg}
                      alt="Career Life Academy"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={WebsterImg}
                      alt="Webster"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={KeystonePartnersImg}
                      alt="Keystone Partners"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={ImpactGroupImg}
                      alt="Impact Group"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-10 mt-10 md:gap-16 lg:gap-20">
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={DaltonStateImg}
                      alt="Dalton State"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={BluedropISMImg}
                      alt="Bluedrop ISM"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={BravantiImg}
                      alt="Bravanti"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={CulverStocktonImg}
                      alt="Culver Stockton"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img className="w-full h-auto" src={ECAImg} alt="ECA" />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={FontbonneUniversityImg}
                      alt="Fontbonne University"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-10 mt-10 md:gap-16 lg:gap-20">
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={GeorgianCollegeImg}
                      alt="Georgian College"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={MohawkCollegeImg}
                      alt="Mohawk College"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={PodiumEducationImg}
                      alt="Podium Education"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={ReinhardtUniversityImg}
                      alt="Reinhardt University"
                    />
                  </div>
                  <div className="w-20 md:w-24">
                    <img
                      className="w-full h-auto"
                      src={SenecaCollegeImg}
                      alt="Seneca College"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-12 md:pt-24 w-full relative px-6 md:px-20 lg:px-40">
              <div className="container mx-auto max-w-[1320px]">
                <h2 className="relative tpBar text-2xl md:text-3xl font-bold text-white mb-6 md:mb-10 text-center pt-5 md:pt-7">
                  Mock Interviews for Over
                  <br />
                  120 Different Job Titles
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4 md:gap-6">
                  {jobTitles.map((job, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center w-24 md:w-28 hover:bg-[#28303d] py-3 md:py-3.5 px-3 md:px-4 rounded-2xl mx-auto transition-all duration-300 ease-in-out"
                    >
                      <img
                        className="w-16 h-16 md:w-full md:h-full mb-2 md:mb-2.5 rounded-full object-cover"
                        src={job.img}
                        alt={job.alt}
                        loading="lazy"
                      />
                      <span className="text-white text-[10px] md:text-[12px] font-bold tracking-wide text-center">
                        {job.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#1A1C1E] text-center py-20 px-6 sm:px-12 md:px-20 lg:px-40">
              <div className="container mx-auto max-w-xl">
                <h4 className="text-sm text-white opacity-70 tracking-widest uppercase mb-6">
                  Get the Job Guarantee
                </h4>
                <img
                  className="w-40 h-auto mx-auto mb-6"
                  src={GTJobGraphicImg}
                  alt="Get the Job Guarantee"
                />
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Our Promise to You
                </h4>
                <p className="text-sm text-white opacity-80 leading-relaxed">
                  We're so confident we can get you interview-ready, we're
                  introducing our Get the Job Guarantee. If you don't get the
                  job, we'll give you your money back. Guaranteed.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#1A1C1E] to-[#28303d] py-16 px-6 sm:px-12 md:px-20 lg:px-40">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10">
                <div className="flex justify-center">
                  <img
                    className="w-full max-w-sm h-auto"
                    src={GuideGraphicImg}
                    alt="Guide Graphic"
                  />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl text-white font-extrabold mb-4">
                    Get a leg up with our training program.
                  </h3>
                  <p className="text-sm text-white opacity-80 leading-relaxed mb-6">
                    Our training program will teach you how to ace the interview
                    and exceed your interviewer's expectations. From preparation
                    to negotiation, we've got you covered.
                  </p>
                  <Link href="#" className="custom-link">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            <div className="testimonail  pt-28  w-full relative float-left "></div>
            <div className="container mx-auto max-w-3xl text-center">
              <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed mb-8">
                "Interviewing can be nerve-wracking, but with this interactive
                tool I was able to gain confidence by polishing my answers,
                being aware of timing, and paying attention to my non-verbal
                language - things that I would not have paid attention to
                otherwise."
              </p>
              <p className="text-sm text-white opacity-80">
                - Marlene Tillman, Digital Marketer
              </p>
            </div>

            <div className="bg-[#1A1C1E] py-20 px-6 sm:px-12 lg:px-40">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                  <div className="flex flex-col items-center text-center">
                    <img
                      className="w-28 h-auto mb-6"
                      src={InterviewsAnywhereImg}
                      alt="Simulate Realistic Interviews Anywhere"
                    />
                    <h3 className="text-lg font-extrabold text-white mb-3">
                      Simulate Realistic Interviews Anywhere
                    </h3>
                    <p className="text-sm text-white opacity-80 leading-relaxed">
                      Take unlimited mock interviews whenever you want, wherever
                      you want.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <img
                      className="w-28 h-auto mb-6"
                      src={BuiltInCameraImg}
                      alt="Put On the Pressure with Your Built-In Camera"
                    />
                    <h3 className="text-lg font-extrabold text-white mb-3">
                      Put On the Pressure with Your Built-In Camera
                    </h3>
                    <p className="text-sm text-white opacity-80 leading-relaxed">
                      We raise the stakes by recording your responses to create
                      realistic interview pressure.
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <img
                      className="w-28 h-auto mb-6"
                      src={ImproveImg}
                      alt="Watch Your Recorded Interviews and Improve"
                    />
                    <h3 className="text-lg font-extrabold text-white mb-3">
                      Watch Your Recorded Interviews and Improve
                    </h3>
                    <p className="text-sm text-white opacity-80 leading-relaxed">
                      Know exactly how you came across and refine your approach
                      to nail the interview.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer className="bg-[#1a1C1E] text-[#e1e5ef] py-14 px-6 md:px-14 lg:px-40">
            <div className="container mx-auto max-w-[1320px]">
              <div className="flex flex-wrap justify-center gap-5 mb-10 text-sm opacity-70">
                {[
                  "Blog",
                  "Contact Us",
                  "FAQs",
                  "Support & How-To Videos",
                  "Terms",
                  "Privacy",
                ].map((item, index) => (
                  <Link key={index} to="#" className="footer-link">
                    {item}
                  </Link>
                ))}
              </div>

              <div className="flex justify-center gap-5 mb-10">
                <Link
                  to="#"
                  target="_blank"
                  sx={{
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "0 20px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="w-6 h-auto rounded-sm"
                    src={FacebookImg}
                    alt="facebook-img"
                  />
                </Link>
                <Link
                  to="#"
                  target="_blank"
                  sx={{
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "0 20px",
                    cursor: "pointer",
                  }}
                >
                  <img
                    className="w-6 h-auto rounded-sm"
                    src={InstagramImg}
                    alt="instagram-img"
                  />
                </Link>
                <Link
                  to="#"
                  target="_blank"
                  sx={{
                    display: "inline-block",
                    fontSize: "16px",
                    margin: "0 20px",
                    cursor: "pointer",
                    borderRadius: "2px",
                    background: "white",
                  }}
                >
                  <img
                    className="w-6 h-auto rounded-sm p-1"
                    src={LinkedinImg}
                    alt="linkedin-img"
                  />
                </Link>
              </div>

              <p className="text-center text-xs tracking-wide opacity-60">
                © 2023 Azure, All Rights Reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Consultant;

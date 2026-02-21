import sakshiImg from '../assets/team/sakshi.jpeg';
import sagarImg from '../assets/team/Sagar.JPG';
import nirjalaImg from '../assets/team/nirjala.jpeg';
import smritiImg from '../assets/team/smiriti.jpeg';
import tanuImg from '../assets/team/tanu.jpeg';
import {
    FaUsers,
    FaShieldAlt,
    FaLightbulb,
    FaChartLine,
    FaCode,
    FaBuilding,
    FaLinkedin,
    FaTwitter,
    FaInstagram
} from 'react-icons/fa';

const developersData = [
    {
        id: 1,
        name: "Sakshi Singh",
        intro: "Team Leader & Full-Stack Developer",
        image: sakshiImg,
        position: "Full-Stack Developer",
        description: "Led the development team and architected both frontend and backend systems using React and Python Flask.",
        contribution: [
            { icon: FaUsers, point: "Team Leadership & Coordination" },
            { icon: FaCode, point: "Frontend & Backend Development" },
            { icon: FaLightbulb, point: "Project Architecture & Planning" }
        ],
        contact: [
            { icon: FaLinkedin, link: "#" },
            { icon: FaTwitter, link: "#" },
        ]
    },
    {
        id: 2,
        name: "Sagar Sah",
        intro: "Full-Stack Developer",
        image: sagarImg,
        position: "Full-Stack Developer",
        description: "Developed key features across the full stack with expertise in React, API integration, and responsive UI design.",
        contribution: [
            { icon: FaCode, point: "React & Component Development" },
            { icon: FaBuilding, point: "API Development & Integration" },
            { icon: FaShieldAlt, point: "Database & Backend Logic" }
        ],
        contact: [
            { icon: FaLinkedin, link: "#" },
            { icon: FaInstagram, link: "#" },
        ]
    },
    {
        id: 3,
        name: "Nirjala",
        intro: "ML & Backend Developer",
        image: nirjalaImg,
        position: "ML & Backend Developer",
        description: "Implemented AI-powered recommendation systems and backend infrastructure with machine learning models.",
        contribution: [
            { icon: FaLightbulb, point: "ML Models & AI Integration" },
            { icon: FaChartLine, point: "Data Processing & Analysis" },
            { icon: FaBuilding, point: "Backend Development" }
        ],
        contact: [
            { icon: FaLinkedin, link: "#" },
            { icon: FaTwitter, link: "#" },
        ]
    },
    {
        id: 4,
        name: "Smriti",
        intro: "Machine Learning Developer",
        image: smritiImg,
        position: "ML Developer",
        description: "Developed intelligent recommendation algorithms and predictive models for personalized travel experiences.",
        contribution: [
            { icon: FaLightbulb, point: "Recommendation Algorithms" },
            { icon: FaChartLine, point: "Predictive Analytics" },
            { icon: FaCode, point: "Model Training & Optimization" }
        ],
        contact: [
            { icon: FaLinkedin, link: "#" },
            { icon: FaTwitter, link: "#" },
        ]
    },
    {
        id: 5,
        name: "Tanu",
        intro: "Backend Developer",
        image: tanuImg,
        position: "Backend Developer",
        description: "Built robust server-side logic and database systems using Python Flask with reliable API design.",
        contribution: [
            { icon: FaBuilding, point: "Server-Side Development" },
            { icon: FaShieldAlt, point: "Database Management" },
            { icon: FaCode, point: "API Design & Implementation" }
        ],
        contact: [
            { icon: FaLinkedin, link: "#" },
            { icon: FaTwitter, link: "#" },
        ]
    }
];

export default developersData;
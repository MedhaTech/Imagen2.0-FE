/* eslint-disable no-irregular-whitespace */
/* eslint-disable indent */
import i1 from "../../assets/img/Themes/new1.png";
import i2 from "../../assets/img/Themes/new2c.png";
import i3 from "../../assets/img/Themes/new3c.png";
import i4 from "../../assets/img/Themes/new4.png";
import i5 from "../../assets/img/Themes/new5.png";
import i6 from "../../assets/img/Themes/new6.png";
import i7 from "../../assets/img/Themes/new7.png";
import i8 from "../../assets/img/Themes/new8.png";
import i9 from "../../assets/img/Themes/new9.png";
import i10 from "../../assets/img/Themes/new10c.png";
import i11 from "../../assets/img/Themes/new11.png";
import i12 from "../../assets/img/Themes/new12.png";
import i13 from "../../assets/img/Themes/new13c.png";
import i14 from "../../assets/img/Themes/new14c.png";
import i15 from "../../assets/img/Themes/new15c.png";
import i16 from "../../assets/img/Themes/new16.png";
import i17 from "../../assets/img/Themes/new17.png";
import i18 from "../../assets/img/Themes/new18.png";



export const themesList = [
    "Smart Automation",
    "Fitness and Sports",
    "Heritage and Culture",
    "MedTech or BioTech or HealthTech",
    "Agriculture, FoodTech and Rural Development",
    "Smart Vehicles",
    "Transportation and Logistics",
    "Robotics and Drones",
    "Clean and Green Technology",
    "Tourism",
    "Renewable or sustainable Energy",
    "Blockchain and Cybersecurity",
    "Smart Education",
    "Disaster Management",
    "Toys and Games",
    "Miscellaneous",
    "Space Technology",
    "Others"
];
export const focusareasList = {
    "Smart Automation": [
        "Renewable Energy (e.g., solar, wind, hydro)",
        "Waste Management (e.g., recycling, composting)",
        "Clean Water (e.g., water purification, rainwater harvesting)",
        "Environment Protection (e.g., pollution control, reforestation)",
        "Sustainable Agriculture (e.g., organic farming, soil conservation)",
        "Others"
    ],
   "Fitness and Sports": [
        "Internet of Things (IoT) (e.g., smart homes, connected devices)",
        "Information Technology (e.g., software, apps)",
        "Cybersecurity (e.g., protecting data, secure online practices)",
        "Blockchain (e.g., secure transactions, decentralized systems)",
        "Artificial Intelligence (AI) & Machine Learning (ML) (e.g., smart assistants, predictive analytics)",
        "Others"
    ],
    "Heritage and Culture" : [
        "Medical Devices (e.g., health monitors, diagnostic tools)",
        "Nutrition and Healthy Eating (e.g., balanced diets, fortified foods)",
        "Mental Health (e.g., stress management, counseling tools)",
        "Fitness and Sports (e.g., exercise programs, sports innovations)",
        "Others"
    ],
    "Quality Education" : [
        "Online Learning (e.g., e-learning platforms, virtual classrooms)",
        "Inclusive Education (e.g., education for all, special needs education)",
        "Teacher Training (e.g., professional development, new teaching methods)",
        "Educational Technology (e.g., interactive learning tools, digital textbooks)" ,
        "Others"
    ],
    "Economic Empowerment" : [
        "Financial Education (e.g., budgeting, saving, investing)",
        "Start-up Innovations (e.g., new business ideas, entrepreneurship support)",
        "Vocational Training (e.g., skill development, job readiness)",
        "Retail Innovations (e.g., new products, better shopping experiences)"  ,
        "Others"
    ],
    "Smart & Resilient Communities" : [
        "Smart Cities (e.g., smart traffic systems, digital public services)",
        "Electric Vehicles (e.g., electric cars, charging stations)",
        "Disaster Management (e.g., emergency response systems, disaster-proof buildings)",
        "Robotics and Drones (e.g., automation, aerial surveys)",
        "Smart Textiles (e.g., wearable technology, smart fabrics)",
        "Travel and Tourism (e.g., eco-tourism, smart travel apps)",
        "Others"
    ],
    "Agriculture & Rural Development" : [
        "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        "Rural Development (e.g., rural infrastructure, community projects)",
        "Food Security (e.g., food storage, distribution systems)",
        "Nutrition (e.g., healthy diets, fortified foods)"  ,
        "Others"
    ],
};

export const themes = [
    {   id: 1, 
        image: i1, 
        title: "Smart Automation", 
        // focusareas: [
        //     "Renewable Energy (e.g., solar, wind, hydro)",
        //     "Waste Management (e.g., recycling, composting)",
        //     "Clean Water (e.g., water purification, rainwater harvesting)",
        //     "Environment Protection (e.g., pollution control, reforestation)",
        //     "Sustainable Agriculture (e.g., organic farming, soil conservation)",
        //     "Others"
        // ], 
        desc: "Ideas focused on the intelligent use of resources for transforming and advancements of technology with combining the artificial intelligence to explore more various sources and get valuable insights.",
    },
    { 
        id: 2, 
        image: i2, 
        title: "Fitness and Sports", 
        // focusareas: [
        //     "Internet of Things (IoT) (e.g., smart homes, connected devices)",
        //     "Information Technology (e.g., software, apps)",
        //     "Cybersecurity (e.g., protecting data, secure online practices)",
        //     "Blockchain (e.g., secure transactions, decentralized systems)",
        //     "Artificial Intelligence (AI) & Machine Learning (ML) (e.g., smart assistants, predictive analytics)",
        //     "Others"
        // ], 
        desc: "Ideas that can boost fitness activities and assist in keeping fit.",
    },
    { 
        id: 3, 
        image: i3, 
        title: "Heritage and Culture", 
        // focusareas: [
        //     "Medical Devices (e.g., health monitors, diagnostic tools)",
        //     "Nutrition and Healthy Eating (e.g., balanced diets, fortified foods)",
        //     "Mental Health (e.g., stress management, counseling tools)",
        //     "Fitness and Sports (e.g., exercise programs, sports innovations)",
        //     "Others"
        // ], 
        desc: "Ideas that showcase the rich cultural heritage and traditions of India.",
    },
    { 
        id: 4, 
        image: i4, 
        title:  "MedTech/BioTech/HealthTech", 
        // focusareas: [
        //     "Online Learning (e.g., e-learning platforms, virtual classrooms)",
        //     "Inclusive Education (e.g., education for all, special needs education)",
        //     "Teacher Training (e.g., professional development, new teaching methods)",
        //     "Educational Technology (e.g., interactive learning tools, digital textbooks)" ,
        //     "Others"
        // ], 
        desc: "Cutting-edge technology in these sectors continues to be in demand. Recent shifts in healthcare trends, growing populations also present an array of opportunities for innovation.",
    },
    { 
        id: 5, 
        image: i5, 
        title:  "Agriculture, FoodTech and Rural Development",
        // focusareas: [
        //     "Financial Education (e.g., budgeting, saving, investing)",
        //     "Start-up Innovations (e.g., new business ideas, entrepreneurship support)",
        //     "Vocational Training (e.g., skill development, job readiness)",
        //     "Retail Innovations (e.g., new products, better shopping experiences)"  ,
        //     "Others"
        // ], 
        desc: "Developing solutions, keeping in mind the need to enhance the primary sector of India - Agriculture and to manage and process our agriculture produce.",
    },
    { 
        id: 6, 
        image: i6, 
        title:  "Smart Vehicles",
        // focusareas: [
        //     "Smart Cities (e.g., smart traffic systems, digital public services)",
        //     "Electric Vehicles (e.g., electric cars, charging stations)",
        //     "Disaster Management (e.g., emergency response systems, disaster-proof buildings)",
        //     "Robotics and Drones (e.g., automation, aerial surveys)",
        //     "Smart Textiles (e.g., wearable technology, smart fabrics)",
        //     "Travel and Tourism (e.g., eco-tourism, smart travel apps)",
        //     "Others"
        // ], 
        desc: "Creating intelligent devices to improve commutation sector.",
    },
    { 
        id: 7, 
        image: i7, 
        title:  "Transportation and Logistics",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Submit your ideas to address the growing pressures on the city’s resources, transport networks, and logistic infrastructure."
    },
    { 
        id: 8, 
        image: i8, 
        title:  "Robotics and Drones",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "There is a need to design drones and robots that can solve some of the pressing challenges of India such as handling medical emergencies, search and rescue operations, etc."
    },  { 
        id: 9, 
        image: i9, 
        title:  "Clean and Green Technology",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Solutions could be in the form of waste segregation, disposal, and improve sanitization system."
    },  { 
        id: 10, 
        image: i10, 
        title:   "Tourism",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "A solution/idea that can boost the current situation of the tourism industries including hotels, travel and others."
    },  { 
        id: 11, 
        image: i11, 
        title:  "Renewable/sustainable Energy",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Encourages innovative solutions in any other area that aligns with the vision of Viksit Bharat 2047, fostering a culture of broad-based development and progressInnovative ideas that help manage and generate renewable /sustainable sources more efficiently."
    },  { 
        id: 12, 
        image: i12, 
        title:  "Blockchain and Cybersecurity",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Provide ideas in a decentralized and distributed ledger technology used to store digital information that powers cryptocurrencies and NFTs and can radically change multiple sectors."
    },  { 
        id: 13, 
        image: i13, 
        title:  "Smart Education",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Smart education,a concept that describes learning in digital age. It enables learners to learn more effectively, efficiently, flexibly and comfortably."
    },  { 
        id: 14, 
        image: i14, 
        title: "Disaster Management",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Disaster management includes ideas related to risk mitigation, Planning and management before, after or during a disaster."
    },  { 
        id: 15, 
        image: i15, 
        title:  "Toys and Games",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Challenge your creative mind to conceptualize and develop unique toys and games based on our civilization, history, and culture etc."
    },  { 
        id: 16, 
        image: i16, 
        title:  "Miscellaneous",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Technology ideas in tertiary sectors like Hospitality, Financial Services, Entertainment and Retail."
    },  { 
        id: 17, 
        image: i17, 
        title:  "Space Technology",
        // focusareas: [
        //     "Modern Farming Techniques (e.g., hydroponics, precision farming)",
        //     "Rural Development (e.g., rural infrastructure, community projects)",
        //     "Food Security (e.g., food storage, distribution systems)",
        //     "Nutrition (e.g., healthy diets, fortified foods)"  ,
        //     "Others"
        // ], 
        desc: "Space technology refers to the application of engineering principles to the design, development, manufacture, and operation of devices and systems for space travel and exploration."
    }, 
    { 
        id: 18, 
        image: i18, 
        title: 'Others', 
        // focusareas: ["Other area that broadly qualifies for the vision of Viksit Bharat"], 
        desc: "Encourages innovative solutions in any other area that aligns with the vision of Viksit Bharat 2047, fostering a culture of broad-based development and progress." 
    }
  ];

export const questions = [
    { qid: 1, title: 'Select a theme which relates to your idea' },
    { qid: 2, title: 'Select focus area' },
    { qid: 3, title: 'Describe your problem statement' },
    { qid: 4, title: 'Give a Title to your IDEA' },
    { qid: 5, title: 'Describe your Idea in detail' },
    { qid: 6, title: 'Share video link of your idea prototype' },
  ];

  
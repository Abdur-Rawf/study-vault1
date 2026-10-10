// Original syllabus data, kept here only for one-time seeding into MySQL.
// After running `npm run seed`, the database is the single source of truth.
module.exports = {
  1: {
    semesters: {
      1: { courses: [
        {code:"ICT 1101", title:"Basic Electrical Circuits", resources:[
          {type:"yt", title:"Electrical Circuits Full Course", link:"https://www.youtube.com/playlist?list=PL2mBI0yFsKk9WfAKrBg59YGVf3B_UnMJA"},
          {type:"yt", title:"Circuit Analysis", link:"https://www.youtube.com/watch?v=rE_0ejMU6yM"},
          {type:"yt", title:"Youtube Playlist", link:"https://www.youtube.com/playlist?list=PL7pX9KMRjdcxCwWDjV-GfDaXQmVO9vml3"}
        ]},
        {code:"ICT 1103", title:"Computer Programming", resources:[
          {type:"yt", title:"C Programming - Full Course", link:"https://www.youtube.com/watch?v=KJgsSFOSQv0"},
          {type:"yt", title:"C Programming - Anisul Islam", link:"https://www.youtube.com/playlist?list=PLgH5QX0i9K3pCMBZcul1fta6UivHDbXvz"},
          {type:"yt", title:"C Programming - Tutorial", link:"https://www.youtube.com/playlist?list=PLNMnAEqLBwmrwDSycdTLsvZBhmK5kOtgV"},
          {type:"yt", title:"C Programming - Tamim Sahriar Subin", link:"https://www.youtube.com/playlist?list=PLym69wpbTIIEHqvuc5ig7uz1fUKbHhVz8"},
          {type:"link", title:"freeCodeCamp C Tutorial", link:"https://www.freecodecamp.org/news/learn-c-programming/"}
        ]},
        {code:"ICT 1105", title:"Physics", resources:[
          {type:"yt", title:"Physics 1 - Full Course", link:"https://www.youtube.com/playlist?list=PL8dPuuaLjXtN0VfHA2f7p5f2E0l4y5jQ"},
          {type:"yt", title:"Physics for Engineers", link:"https://www.youtube.com/playlist?list=PLeWUkVKBx-3wJL8JHa5glSzpQd3Mimv9O"}
        ]},
        {code:"ICT 1107", title:"Differential and Integral Calculus", resources:[
          {type:"yt", title:"Calculus 1 - Khan Academy", link:"https://www.youtube.com/playlist?list=PLF797E96109E0B3E7"},
          {type:"yt", title:"Calculus full playlist", link:"https://www.youtube.com/playlist?list=PL1BE3027EF549C7D1"},
          {type:"yt", title:"Free Code Camp's Lecture", link:"https://www.youtube.com/watch?v=HfACrKJ_Y2w"}
        ]},
        {code:"ICT 1109", title:"Chemistry", resources:[
          {type:"yt", title:"Engineering Chemistry", link:"https://www.youtube.com/playlist?list=PLp4Dpe0PSs-Ued_L2yYneasUOSPJ1naXM"},
          {type:"yt", title:"Youtube Playlist", link:"https://www.youtube.com/playlist?list=PL7IhposCM6bVt3xn0pU8ZjnATp9YsFXOt"},
          {type:"yt", title:"Chemistry's Lecture", link:"https://www.youtube.com/playlist?list=PLg2LVpcRrOF5BVVKG_DdYRPEaMx6C9XsW"}
        ]}
      ]},
      2: { courses: [
        {code:"ICT 1201", title:"Electronic Devices and Circuit Theory", resources:[
          {type:"yt", title:"Electronic Devices & Circuits - NPTEL", link:"https://www.youtube.com/playlist?list=PL3744A3C132C7A92C"},
          {type:"yt", title:"Electronic Devices & Circuit Theory - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiHO1wVeb24k8nSde23M9s0P"}
        ]},
        {code:"ICT 1203", title:"Data Structure", resources:[
          {type:"yt", title:"Data Structures & Algorithms - Bangla", link:"https://www.youtube.com/playlist?list=PLdl6zXgLsy3w1m6Hl5g2wfCJOLhBR8bg_"},
          {type:"yt", title:"Data Structures Course - mycodeschool", link:"https://www.youtube.com/playlist?list=PL2_aWCzGMAwI3W_JlcBbtYTwiQSsOTa6P"},
          {type:"link", title:"GeeksforGeeks Data Structures", link:"https://www.geeksforgeeks.org/data-structures/"}
        ]},
        {code:"ICT 1205", title:"Discrete Mathematics", resources:[
          {type:"yt", title:"Discrete Mathematics - TrevTutor", link:"https://www.youtube.com/playlist?list=PLDDGPhmwFy80KX35aO5y2n0e6K9v5i96x"},
          {type:"yt", title:"Discrete Mathematics Course - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7p09kL6_w1rInJ23BIs"}
        ]},
        {code:"ICT 1207", title:"Matrices and Coordinate Geometry", resources:[
          {type:"yt", title:"Linear Algebra - 3Blue1Brown", link:"https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab"},
          {type:"yt", title:"Matrices and Coordinate Geometry Lectures", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acRndW1I3X32A5oV9gSjA89R"}
        ]},
        {code:"ICT 1209", title:"History of the Emergence of Bangladesh", resources:[
          {type:"yt", title:"History of Independent Bangladesh Lecture Series", link:"https://www.youtube.com/results?search_query=history+of+the+emergence+of+independent+bangladesh"},
          {type:"link", title:"Banglapedia - Liberation War", link:"https://en.banglapedia.org/index.php/War_of_the_Liberation"}
        ]},
        {code:"ICT 1211", title:"English Language and Literature", resources:[
          {type:"yt", title:"English Grammar & Communication Skills", link:"https://www.youtube.com/playlist?list=PLc34L_e4X1z7oI9U7Tsyu1aC0B9K_kH5R"},
          {type:"link", title:"BBC Learning English", link:"https://www.bbc.co.uk/learningenglish/"}
        ]}
      ]}
    }
  },
  2: {
    semesters: {
      1: { courses: [
        {code:"ICT 2101", title:"Operational Amplifier and Integrated Circuits", resources:[
          {type:"yt", title:"Op-Amp & Linear Integrated Circuits", link:"https://www.youtube.com/playlist?list=PL38C3B1405DEBB99E"},
          {type:"yt", title:"Op-Amps Tutorials - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiGv3uO6xL7m1RIny706E45f"}
        ]},
        {code:"ICT 2105", title:"Digital Logic Design", resources:[
          {type:"yt", title:"Digital Electronics & Logic Design - Neso Academy", link:"https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3Ed3Su4hSrDud_C441U"},
          {type:"link", title:"GeeksforGeeks Digital Electronics", link:"https://www.geeksforgeeks.org/digital-electronics-logic-design-tutorials/"}
        ]},
        {code:"ICT 2107", title:"Object Oriented Programming", resources:[
          {type:"yt", title:"OOP Java Full Course", link:"https://www.youtube.com/watch?v=3EJALj4v7gY"},
          {type:"yt", title:"Java & OOP - Anisul Islam", link:"https://www.youtube.com/playlist?list=PLgH5QX0i9K3oAZUB2QCR4NXAaL8QN22S8"}
        ]},
        {code:"ICT 2109", title:"Database Management System", resources:[
          {type:"yt", title:"DBMS Full Course - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y"},
          {type:"yt", title:"Database Management Systems - NPTEL", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acS41I3-J2d4pQGZtS8lMhS4"}
        ]}
      ]},
      2: { courses: [
        {code:"ICT 2201", title:"Operating System", resources:[
          {type:"yt", title:"Operating Systems Tutorial - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6Xup8p"},
          {type:"yt", title:"Operating System Course - Neso Academy", link:"https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O"}
        ]},
        {code:"ICT 2203", title:"Microprocessor and Embedded Systems", resources:[
          {type:"yt", title:"Microprocessor 8085 & 8086 - Bharat Acharya", link:"https://www.youtube.com/playlist?list=PL3A76C1BAA9E19B24"},
          {type:"yt", title:"Microprocessors & Microcontrollers", link:"https://www.youtube.com/playlist?list=PL0E128033A3030EF1"}
        ]},
        {code:"ICT 2205", title:"Communication Engineering", resources:[
          {type:"yt", title:"Principles of Communication Engineering", link:"https://www.youtube.com/playlist?list=PL9E6B5DDF400D550A"},
          {type:"yt", title:"Analog and Digital Communication Systems", link:"https://www.youtube.com/playlist?list=PLX2gX-ftPVXU3O7mHjM2d1D5U6u3X2cW_"}
        ]},
        {code:"ICT 2207", title:"Algorithm Analysis and Design", resources:[
          {type:"yt", title:"Design and Analysis of Algorithms - Abdul Bari", link:"https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkfO3bWG4sncwCxnKBcq_"},
          {type:"link", title:"GeeksforGeeks Analysis of Algorithms", link:"https://www.geeksforgeeks.org/fundamentals-of-algorithms/"}
        ]}
      ]}
    }
  },
  3: {
    semesters: {
      1: { courses: [
        {code:"ICT 3101", title:"Data Communication", resources:[
          {type:"drive", title:"Chapter 1 Slide", link:"https://drive.google.com/file/d/1_-12_nwbyUWXO7FEnwXwrMO8AVZ-xc2Z/view?usp=sharing"},
          {type:"drive", title:"Chapter 2 Slide", link:"https://drive.google.com/file/d/12z68GMQRTfZIgjb6PkS8PEB2CjxUZmN-/view?usp=sharing"},
          {type:"drive", title:"Chapter 3 Slide", link:"https://drive.google.com/file/d/1qEvNEZKxdXLz8F2XcDwwElaBfN49wPeu/view?usp=sharing"},
          {type:"drive", title:"Chapter 4 Slide", link:"https://drive.google.com/file/d/1HhDvWoFH7_hswsrNMWw5emFvD-bn2l5K/view?usp=sharing"},
          {type:"drive", title:"Chapter 5 Slide", link:"https://drive.google.com/file/d/1851o6T7pJgoa11499qjz61lmfqfGO7i4/view?usp=sharing"},
          {type:"drive", title:"Chapter 6 Slide", link:"https://drive.google.com/file/d/1IpznmMEpbNLMHCGK86u-vXVNXI-PSskg/view?usp=sharing"},
          {type:"drive", title:"Chapter 7 Slide", link:"https://drive.google.com/file/d/1CDYN-FdUuiSvsDoii_9UN1akquCCahY0/view?usp=sharing"}
        ]},
        {code:"ICT 3103", title:"Microwave Engineering", resources:[
          {type:"yt", title:"Microwave Engineering - NPTEL", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acSWcWd-Vat4sO3X8zS2lXoV"},
          {type:"yt", title:"Microwave Engineering Tutorials", link:"https://www.youtube.com/playlist?list=PL34G8N36wH5Y2WfH9D1W0_S7Vj2_x2e9B"}
        ]},
        {code:"ICT 3105", title:"Artificial Intelligence and Expert Systems", resources:[
          {type:"yt", title:"Artificial Intelligence Full Course", link:"https://www.youtube.com/watch?v=3EJALj4v7gY"},
          {type:"yt", title:"Artificial Intelligence Course - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiHGjxIudS-V-0S9T2G47481"}
        ]},
        {code:"ICT 3107", title:"Theory of Computation", resources:[
          {type:"yt", title:"Theory of Computation & Automata - Neso Academy", link:"https://www.youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOXYM"},
          {type:"yt", title:"TOC Tutorials - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9Lj5G9G_762GGg9dC51D"}
        ]},
        {code:"ICT 3108", title:"Software Engineering", resources:[
          {type:"yt", title:"Software Engineering Tutorials - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7p09kL6_w1rInJ23BIs"},
          {type:"link", title:"GeeksforGeeks Software Engineering", link:"https://www.geeksforgeeks.org/software-engineering/"}
        ]}
      ]},
      2: { courses: [
        {code:"ICT 3201", title:"Computer Networks", resources:[
          {type:"yt", title:"Computer Networks Course - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_"},
          {type:"yt", title:"Computer Networking Full Course - freeCodeCamp", link:"https://www.youtube.com/watch?v=IPvYjXWkl6Y"}
        ]},
        {code:"ICT 3203", title:"Web Application Development", resources:[
          {type:"yt", title:"Full Stack Web Development", link:"https://www.youtube.com/watch?v=3EJALj4v7gY"},
          {type:"yt", title:"Web Development Course - freeCodeCamp", link:"https://www.youtube.com/watch?v=nu_pCVPKzTk"}
        ]},
        {code:"ICT 3207", title:"Digital Signal Processing", resources:[
          {type:"yt", title:"Digital Signal Processing (DSP) Lectures", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acS-02X-y1I6LpD8B5R3q4V0"},
          {type:"yt", title:"DSP Course - NPTEL", link:"https://www.youtube.com/playlist?list=PL68E42FA5DDF305FA"}
        ]},
        {code:"ICT 3209", title:"Statistics for Engineers", resources:[
          {type:"yt", title:"Statistics for Engineering - Khan Academy", link:"https://www.youtube.com/playlist?list=PL1328115D3D8A2566"},
          {type:"yt", title:"Engineering Statistics Full Course", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acTYXW2k9G3s8K1F8W3O2M2e"}
        ]}
      ]}
    }
  },
  4: {
    semesters: {
      1: { courses: [
        {code:"ICT 4101", title:"Data Mining", resources:[
          {type:"yt", title:"Data Mining & Data Warehousing - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiEED8J7g4i6m9O3o2L3P2F5"},
          {type:"yt", title:"Data Mining Course - NPTEL", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acX4Y1a5jX1W2lV3B5j0I4Q_"}
        ]},
        {code:"ICT 4103", title:"Digital Image Processing", resources:[
          {type:"yt", title:"Digital Image Processing Lectures - NPTEL", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acT0s9vO0s4I21D5Rj1vW11_"},
          {type:"yt", title:"Image Processing Course - Gate Smashers", link:"https://www.youtube.com/playlist?list=PLxCzCOWd7aiGv3uO6xL7m1RIny706E45f"}
        ]},
        {code:"ICT 4105", title:"Optical Communication", resources:[
          {type:"yt", title:"Optical Fiber Communication Systems", link:"https://www.youtube.com/playlist?list=PLbRMhDVg3acR9zI1C2R5S09O9E7z-A53f"},
          {type:"yt", title:"Optical Communication - NPTEL", link:"https://www.youtube.com/playlist?list=PL34G8N36wH5W1R3x4E6a3K4pX1M8V9L5m"}
        ]}
      ]},
      2: { courses: [
        {code:"ICT 4200", title:"Project / Thesis & Internship", resources:[
          {type:"yt", title:"How to Write a Research Paper / Thesis", link:"https://www.youtube.com/watch?v=aG_X1Fv0Lno"},
          {type:"link", title:"Google Scholar - Research Publications", link:"https://scholar.google.com/"}
        ]}
      ]}
    }
  }
};

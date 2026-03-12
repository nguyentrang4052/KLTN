export const userData = {
  name: 'Trần Văn Ngọc',
  initials: 'TN',
  role: 'Senior Dev',
  email: 'ngoc.tran@gmail.com',
  phone: '0912 345 678',
  location: 'Quận Bình Thạnh, TP.HCM',
  linkedin: 'linkedin.com/in/ngoctran-dev',
  github: 'github.com/ngoctran-dev',
  dob: '15/03/1995'
}

export const jobData = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'FPT Software',
    location: 'TP.HCM',
    type: 'Hybrid',
    salary: '25–35 triệu/tháng',
    match: 94,
    platform: 'TopCV',
    logo: 'F',
    color: 'l-fpt',
    tags: ['React', 'TypeScript', 'Node.js']
  },
  {
    id: 2,
    title: 'Full-stack Engineer (Python + React)',
    company: 'VNG Corporation',
    location: 'Quận 7, HCM',
    type: 'Remote',
    salary: '30–45 triệu/tháng',
    match: 89,
    platform: 'CareerViet',
    logo: 'V',
    color: 'l-vng',
    tags: ['Python', 'React', 'AWS']
  },
  {
    id: 3,
    title: 'Frontend Lead Engineer',
    company: 'Shopee Vietnam',
    location: 'Quận 1, HCM',
    type: 'Onsite',
    salary: '40–60 triệu/tháng',
    match: 85,
    platform: 'CareerLink',
    logo: 'S',
    color: 'l-shopee',
    tags: ['React', 'Performance', 'Team Lead']
  },
  {
    id: 4,
    title: 'Frontend Lead Engineer',
    company: 'Shopee Vietnam',
    location: 'Quận 1, HCM',
    type: 'Onsite',
    salary: '40–60 triệu/tháng',
    match: 85,
    platform: 'CareerLink',
    logo: 'S',
    color: 'l-shopee',
    tags: ['React', 'Performance', 'Team Lead']
  }

]

export const applicationsData = {
  submitted: [
    { id: 1, job: 'Senior React Developer', company: 'FPT Software', salary: '25-35tr', location: 'HN', date: '03/03/2026', platform: 'TopCV', auto: true },
    { id: 2, job: 'Frontend Lead Engineer', company: 'Shopee VN', salary: '40-60tr', type: 'Onsite', date: '02/03/2026', platform: 'CareerLink', auto: true },
    { id: 3, job: 'Software Engineer II', company: 'Grab VN', salary: '35-50tr', type: 'Hybrid', date: '01/03/2026', auto: false }
  ],
  reviewing: [
    { id: 4, job: 'Full-stack Engineer', company: 'VNG Corp', salary: '30-45tr', type: 'Remote', date: '25/02/2026', status: 'Đang xem CV' },
    { id: 5, job: 'Backend Developer', company: 'MoMo', salary: '20-30tr', location: 'HCM', date: '22/02/2026' }
  ],
  interview: [
    { id: 6, job: 'React Native Developer', company: 'Tiki Corp', salary: '22-32tr', date: '06/03/2026', time: '14:00' },
    { id: 7, job: 'Senior Frontend Dev', company: 'Zalo', salary: '30-40tr', date: '08/03/2026', time: '09:00' }
  ],
  offer: [
    { id: 8, job: 'Frontend Tech Lead', company: 'VNPay', salary: '45-55 triệu/tháng', accepted: false }
  ]
}

export const cvData = {
  personal: {
    fullName: 'Trần Văn Ngọc',
    title: 'Senior Frontend Developer',
    email: 'ngoc.tran@gmail.com',
    phone: '0912 345 678',
    linkedin: 'linkedin.com/in/ngoctran-dev',
    github: 'github.com/ngoctran-dev',
    location: 'Quận Bình Thạnh, TP.HCM',
    website: '',
    dob: '15/03/1995'
  },
  objective: 'Senior Frontend Developer với 4+ năm kinh nghiệm xây dựng ứng dụng React hiệu suất cao. Đã dẫn dắt team 5–8 người và deliver thành công nhiều dự án lớn tại các công ty Fintech và E-commerce. Tìm kiếm cơ hội phát triển vai trò Tech Lead tại môi trường năng động.',
  experience: [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'VNG Corporation',
      from: '01/2023',
      to: 'Hiện tại',
      location: 'TP. Hồ Chí Minh',
      type: 'Hybrid',
      description: `• Phát triển module quản lý người dùng Zalo Business với 500K+ DAU, sử dụng React + TypeScript
• Tối ưu hiệu suất: giảm LCP từ 4.2s xuống 1.8s, tăng Core Web Vitals 40%
• Lead team 6 Frontend developers, thiết lập quy trình code review và CI/CD
• Xây dựng design system với 80+ component dùng chung toàn hệ thống`,
      technologies: 'React.js, TypeScript, Redux Toolkit, GraphQL, Jest, Webpack, AWS S3'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'FPT Software',
      from: '06/2021',
      to: '12/2022',
      location: 'Hà Nội',
      type: 'Onsite',
      description: `• Xây dựng dashboard quản lý khách hàng Nhật Bản (React + TypeScript)
• Tích hợp RESTful API và WebSocket real-time cho hệ thống monitoring
• Viết unit test với Jest, đạt coverage 85%`,
      technologies: 'React, TypeScript, REST API, WebSocket, Jest'
    }
  ],
  education: {
    school: 'ĐH Bách Khoa TP.HCM',
    degree: 'Kỹ sư CNTT',
    year: '2021',
    gpa: '3.4/4.0 — Giỏi',
    achievements: 'Phó chủ nhiệm CLB Lập trình BKU-IT, Top 5 ACM ICPC khu vực phía Nam 2020'
  },
  skills: [
    { name: 'React.js / React Native', level: 4, label: 'Chuyên gia' },
    { name: 'TypeScript', level: 3, label: 'Thành thạo' },
    { name: 'Node.js / Express', level: 3, label: 'Thành thạo' },
    { name: 'Python / Django', level: 2, label: 'Trung bình' },
    { name: 'PostgreSQL / MongoDB', level: 2, label: 'Trung bình' },
    { name: 'Docker / CI-CD', level: 1, label: 'Cơ bản' },
    { name: 'Figma / UI Design', level: 2, label: 'Trung bình' }
  ],
  languages: [
    { name: 'Tiếng Anh', level: 'Giao tiếp tốt (B2)', cert: 'IELTS 7.0', badge: 'sage' },
    { name: 'Tiếng Việt', level: 'Bản ngữ', cert: 'Bản ngữ', badge: 'teal' },
    { name: 'Tiếng Nhật', level: 'Cơ bản (N4)', cert: 'N4', badge: 'amber' }
  ],
  projects: [
    {
      title: 'E-Commerce Platform (Microservices)',
      links: ['github.com/...', 'Live demo'],
      description: 'Nền tảng thương mại điện tử với kiến trúc microservices, xử lý 10,000+ đơn hàng/ngày. Tích hợp payment gateway VNPay, MOMO.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
    },
    {
      title: 'AI Job Matching App',
      links: ['Portfolio'],
      description: 'Ứng dụng tìm việc tích hợp AI gợi ý công việc phù hợp theo kỹ năng người dùng. 2000+ user trong tháng đầu.',
      tech: ['React Native', 'Python', 'TensorFlow', 'FastAPI']
    }
  ],
  certifications: [
    { name: 'AWS Certified Developer – Associate', org: 'Amazon Web Services', year: '2024', expiry: '2027', icon: '🏅' },
    { name: 'Top 5 Hackathon VNG Innovation 2023', org: 'VNG Corporation', year: '2023', icon: '🎖' },
    { name: 'Meta Frontend Developer Certificate', org: 'Coursera / Meta', year: '2022', icon: '📜' }
  ],
  reference: {
    name: 'Nguyễn Văn Minh',
    position: 'Engineering Manager',
    company: 'VNG Corporation',
    email: 'minh.nguyen@vng.com.vn',
    hideDetails: true
  }
}

export const notificationsData = [
  {
    id: 1,
    icon: '🎉',
    bg: '#E0F0E6',
    title: 'VNPay đã gửi Offer Letter!',
    desc: 'Chúc mừng! VNPay offer vị trí Frontend Tech Lead, mức 45-55tr/tháng. Hạn phản hồi 10/03/2026.',
    time: '5 phút trước',
    unread: true
  },
  {
    id: 2,
    icon: '📅',
    bg: '#FEF0D0',
    title: 'Nhắc phỏng vấn — Tiki Corporation',
    desc: 'Lịch phỏng vấn lúc 14:00 ngày mai (06/03). AI đã chuẩn bị danh sách câu hỏi thường gặp.',
    time: '1 giờ trước',
    unread: true
  },
  {
    id: 3,
    icon: '⚡',
    bg: '#FDE8E4',
    title: 'Auto Apply thành công — CareerLink',
    desc: 'Đã tự động nộp CV vào "Frontend Lead" tại Shopee trên CareerLink. Mã: #CL20260302.',
    time: '3 giờ trước',
    unread: true
  },
  {
    id: 4,
    icon: '🤖',
    bg: '#E4E5F8',
    title: 'AI tìm thấy 12 việc mới phù hợp',
    desc: 'Dựa trên hành vi hôm nay, AI tìm 12 tin React Developer mới, trong đó 3 tin có match >90%.',
    time: '5 giờ trước',
    unread: true
  }
]
import React from 'react';

// Dữ liệu giả định cho phần Partner, bạn có thể thay thế bằng dữ liệu API hoặc URL hình ảnh thực tế
const partners = [
    { src: '/img/logobhd.png', alt: 'Partner 1' }, // Thay thế bằng URL icon thực tế
    { src: '/img/logocgv.jpg', alt: 'Partner 2' },
    { src: '/img/logostar.png', alt: 'Partner 3' },
    { src: '/img/galaxy.png', alt: 'Partner 4' },
    { src: '/img/lotte.webp', alt: 'Partner 5' },
    { src: '/img/mega.png', alt: 'Partner 6' },
];

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-10 px-4 md:px-20">
            {/* Vùng nội dung chính */}
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
                    
                    {/* Cột 1: Logo và Tên Công Ty */}
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-2">
                            {/* Logo CyberLearn */}
                            {/* Bạn nên thay thế bằng component hoặc thẻ img logo thực tế của mình */}
                            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-yellow-500">CYBERLEARN</span>
                                <span className="text-xs text-gray-400">ĐÀO TẠO CHUYÊN GIA LẬP TRÌNH</span>
                            </div>
                        </div>
                    </div>

                    {/* Cột 2: Partner */}
                    <div className="md:justify-self-center">
                        <h3 className="text-lg font-semibold mb-4">PARTNER</h3>
                        <div className="grid grid-cols-3 gap-4 max-w-xs">
                            {partners.map((p, index) => (
                                <img
                                    key={index}
                                    src={p.src}
                                    alt={p.alt}
                                    className="h-10 w-10 object-contain p-1 bg-white rounded-full shadow-lg" // Thêm nền trắng và bo tròn để logo nổi bật
                                />
                            ))}
                        </div>
                    </div>

                    {/* Cột 3: Mobile App Icons */}
                    <div className="md:justify-self-end">
                        <h3 className="text-lg font-semibold mb-4">Mobile app</h3>
                        <div className="flex space-x-4 text-2xl">
                            {/* Apple Icon */}
                            <a href="#" aria-label="Tải trên App Store">
                                <i className="fab fa-apple text-gray-400 hover:text-white" />
                            </a>
                            {/* Facebook Icon (Giả định bạn dùng icon Facebook cho liên kết) */}
                            <a href="#" aria-label="Theo dõi trên Facebook">
                                <i className="fab fa-facebook text-gray-400 hover:text-white" />
                            </a>
                            {/* Thêm Google Play nếu cần */}
                            <a href="#"><i className="fab fa-google-play text-gray-400 hover:text-white" /></a>
                        </div>
                    </div>
                </div>

                {/* Vùng Bản quyền */}
                <div className="mt-8 text-center md:text-left">
                    <p className="text-sm text-gray-400">
                        ©2025 | All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}
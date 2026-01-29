"use client";

import { useState } from "react";
import { CustomerInfo } from "@/types";

interface StaffInputProps {
    onStart: (info: CustomerInfo, turns: number) => void;
}

export default function StaffInput({ onStart }: StaffInputProps) {
    const [formData, setFormData] = useState<CustomerInfo>({
        hoTen: "",
        sdt: "",
        chiNhanh: "",
        khuVuc: "",
        tongBill: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const turns = Math.floor(formData.tongBill / 500000);
        if (turns > 0) {
            onStart(formData, turns);
        } else {
            alert("Hóa đơn phải từ 500.000đ trở lên để tham gia!");
        }
    };

    return (
        <div className="min-h-screen bg-background-light w-full flex flex-col relative overflow-hidden transition-colors duration-300">

            {/* Background Effects */}
            <div className="falling-leaves">
                <div className="leaf" style={{ left: '10%', animationDuration: '8s', animationDelay: '0s' }}></div>
                <div className="leaf" style={{ left: '20%', animationDuration: '12s', animationDelay: '2s' }}></div>
                <div className="leaf" style={{ left: '35%', animationDuration: '7s', animationDelay: '4s' }}></div>
                <div className="leaf" style={{ left: '50%', animationDuration: '11s', animationDelay: '1s' }}></div>
                <div className="leaf" style={{ left: '65%', animationDuration: '9s', animationDelay: '3s' }}></div>
                <div className="leaf" style={{ left: '80%', animationDuration: '13s', animationDelay: '5s' }}></div>
            </div>
            <div className="absolute inset-0 opacity-10 bg-pattern pointer-events-none z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 pointer-events-none z-0"></div>

            {/* Decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-10 opacity-90">
                <img alt="Apricot Blossom" className="w-full h-full object-cover object-bottom rounded-br-full shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsFTjSd3EBlFEe_1U_krLH0BdRnBz0hVFuICgGZpGznejTvAUhvOwLlmDobOflVn7LJJblPBc9SgtTWgi5yOEMF2ZP6U8qgPP5fIJN7K2WD9m-jU5-5eLLkfhmNlh__-6Wy8siqpPGKU2uk1vSUFHJYDItitE0CXdNwp_XLXpIKV2kyhgl5mxubQq17iZolrc6hFu_s03u25ozXq05KZ7XKLf9C09EEoGnEU2i-yaR3Hz3u2KmWE6335ZykIXwQfskCkYgOJYIJ98" style={{ maskImage: 'radial-gradient(circle at top left, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at top left, black 60%, transparent 100%)' }} />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-10 opacity-90">
                <img alt="Peach Blossom" className="w-full h-full object-cover object-bottom rounded-bl-full shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRoNtkO9e2lLxWOgsB9h7LKaHlFQsE70oy-PrZEuxmLdW35GrqqJedNmOypv6AAZtl_3y6zS47EtiPkCFtd12o_NaxOkj9tfEn7NPTCXKWEV7qz7vuDu-Se8MQO1z3kZp1AJAVQhQRJ2t33BqVfJU2ufBIYXoiQyr6LwJg94Zn4zl5hLeDxWy_RGNXWBjqURAJ7ZCvWATm_QP6AVGwItVHmSOWYE3Ebwdjkw-tpV3g89RG1RIh4IT0vKKrBfBLji_nx_h1yqn5azw" style={{ maskImage: 'radial-gradient(circle at top right, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at top right, black 60%, transparent 100%)', filter: 'hue-rotate(-20deg)' }} />
            </div>

            <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative z-20 w-full max-w-4xl mx-auto">
                <header className="mb-8 md:mb-12 text-center w-full">
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-tet-gold to-yellow-600 drop-shadow-md tracking-wide uppercase" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                        Hái Lộc Đầu Xuân
                    </h1>
                    <p className="text-cream/80 mt-2 text-sm md:text-lg font-light tracking-widest uppercase">Khai xuân như ý - Phú quý toàn niên</p>
                </header>

                <div className="w-full max-w-lg bg-cream rounded-2xl shadow-2xl border-4 border-tet-gold/50 p-6 md:p-10 relative backdrop-blur-sm bg-opacity-95 text-gray-800">
                    <div className="absolute inset-2 border border-tet-gold/30 rounded-xl pointer-events-none"></div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-tet-red mb-2">THÔNG TIN KHÁCH HÀNG</h2>
                        <p className="text-gray-500 text-sm">Nhập thông tin để bắt đầu Hái Lộc</p>
                    </div>

                    <form className="space-y-4 md:space-y-5" onSubmit={handleSubmit}>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-icons-round text-gray-400 text-xl">person</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tet-gold focus:border-transparent transition-shadow shadow-sm"
                                placeholder="Họ và tên khách hàng"
                                required
                                value={formData.hoTen}
                                onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-icons-round text-gray-400 text-xl">phone</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tet-gold focus:border-transparent transition-shadow shadow-sm"
                                placeholder="Số điện thoại"
                                required
                                type="tel"
                                value={formData.sdt}
                                onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-round text-gray-400 text-xl">place</span>
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tet-gold focus:border-transparent transition-shadow shadow-sm"
                                    placeholder="Khu vực"
                                    required
                                    value={formData.khuVuc}
                                    onChange={(e) => setFormData({ ...formData, khuVuc: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="material-icons-round text-gray-400 text-xl">store</span>
                                </div>
                                <select
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-tet-gold focus:border-transparent transition-shadow shadow-sm appearance-none cursor-pointer"
                                    required
                                    value={formData.chiNhanh}
                                    onChange={(e) => setFormData({ ...formData, chiNhanh: e.target.value })}
                                >
                                    <option value="" disabled>Chọn chi nhánh</option>
                                    <option value="Đông Nguyên Chợ Lớn">Đông Nguyên Chợ Lớn</option>
                                    <option value="Đông Nguyên PMH">Đông Nguyên PMH</option>
                                    <option value="DonDon ParcMall">DonDon ParcMall</option>
                                    <option value="DonDon Thisomall">DonDon Thisomall</option>
                                    <option value="Đông Hỷ">Đông Hỷ</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="material-icons-round text-gray-400 text-xl">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="material-icons-round text-gray-400 text-xl">receipt_long</span>
                            </div>
                            <input
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tet-gold focus:border-transparent transition-shadow shadow-sm"
                                placeholder="Tổng hóa đơn"
                                required
                                type="number"
                                min="500000"
                                value={formData.tongBill || ""}
                                onChange={(e) => setFormData({ ...formData, tongBill: Number(e.target.value) })}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-medium text-sm">VNĐ</span>
                            </div>
                        </div>

                        <div className="h-2"></div>

                        <button
                            className="sparkle-btn w-full bg-gradient-to-r from-tet-gold via-yellow-400 to-tet-gold hover:from-yellow-400 hover:to-yellow-300 text-tet-red font-display font-black text-lg md:text-xl py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 border border-yellow-300 uppercase tracking-wide cursor-pointer"
                            type="submit"
                        >
                            Bắt Đầu Hái Lộc
                        </button>
                    </form>
                </div>
            </main>

            <footer className="text-center py-8 relative z-20 opacity-80 flex flex-col items-center">
                <img src="/logo.png" alt="Company Logo" className="w-24 md:w-32 mb-3 drop-shadow-xl brightness-125 contrast-125 hover:scale-105 transition-transform duration-300" />
                <p className="text-cream text-xs md:text-sm font-light">© 2026 Lunar New Year Campaign · Chúc Mừng Năm Mới</p>
            </footer>
        </div>
    );
}

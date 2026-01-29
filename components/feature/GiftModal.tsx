"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";
import { GiftResult } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface GiftModalProps {
    result: GiftResult | null;
    onClose: () => void;
    isOpen: boolean;
}

export default function GiftModal({ result, onClose, isOpen }: GiftModalProps) {
    useEffect(() => {
        if (isOpen && result) {
            // Confetti Explosion
            var duration = 3 * 1000;
            var animationEnd = Date.now() + duration;
            var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };

            var random = function (min: number, max: number) {
                return Math.random() * (max - min) + min;
            };

            var interval: any = setInterval(function () {
                var timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                var particleCount = 50 * (timeLeft / duration);

                // since particles fall down, start a bit higher than random
                confetti({ ...defaults, particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen, result]);

    if (!isOpen || !result) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="relative w-full max-w-lg"
                >
                    {/* 3D Bao Li Xi Background - Absolute center behind content */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform scale-110 opacity-20 pointer-events-none blur-sm z-0">
                        <div className="bao-li-xi">
                            <div className="envelope-top flex justify-center items-start pt-4">
                                <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] absolute top-0 left-0"></div>
                            </div>
                            <div className="coin-seal">
                                <div className="coin-inner-ring"></div>
                                <span>MỞ</span>
                            </div>
                            <div className="flex-grow flex flex-col items-center justify-end pb-8 relative">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
                                <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mb-2"></div>
                                <div className="text-tet-gold text-lg tracking-[0.4em] font-display font-bold uppercase text-center drop-shadow-md z-10">
                                    Phát Tài<br />Phát Lộc
                                </div>
                                <span className="material-symbols-outlined absolute bottom-4 left-4 text-yellow-500/40 text-3xl">water_drop</span>
                                <span className="material-symbols-outlined absolute bottom-4 right-4 text-yellow-500/40 text-3xl">local_florist</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-30 flex flex-col items-center w-full">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-lg tracking-wide uppercase" style={{ textShadow: "0 4px 8px rgba(0,0,0,0.5)" }}>
                                Chúc Mừng!
                            </h2>
                            <p className="text-cream/90 font-light mt-1 tracking-widest text-sm uppercase">Bạn đã trúng thưởng</p>
                        </div>

                        <div className="w-full bg-[#FFF8E7] rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-double border-[#B71C1C] relative overflow-hidden p-6 md:p-10 transform transition-transform hover:scale-105 duration-500">
                            {/* Decorative Corners */}
                            <div className="absolute top-2 left-2 w-16 h-16 border-t-2 border-l-2 border-[#D4AF37] opacity-60 rounded-tl-lg"></div>
                            <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-[#D4AF37] opacity-60 rounded-tr-lg"></div>
                            <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-[#D4AF37] opacity-60 rounded-bl-lg"></div>
                            <div className="absolute bottom-2 right-2 w-16 h-16 border-b-2 border-r-2 border-[#D4AF37] opacity-60 rounded-br-lg"></div>

                            <div className="flex flex-col items-center text-center h-full relative z-10">
                                <div className="mb-4 p-4 rounded-full bg-red-100 border border-red-200">
                                    <span className="material-symbols-outlined text-4xl text-[#B71C1C]">loyalty</span>
                                </div>
                                <h3 className="text-[#B71C1C] font-display font-bold text-lg md:text-xl uppercase tracking-wider mb-2">
                                    {result.name}
                                </h3>
                                <div className="w-12 h-1 bg-[#D4AF37] mb-6"></div>

                                {result.code ? (
                                    <>
                                        <div className="bg-red-50 border-2 border-dashed border-[#B71C1C]/30 text-[#B71C1C] py-5 px-4 md:px-8 rounded-lg w-full mb-4 relative overflow-hidden">
                                            <p className="text-2xl md:text-3xl font-mono font-black tracking-widest break-all">
                                                {result.code}
                                            </p>
                                        </div>
                                        <p className="text-gray-500 text-xs md:text-sm max-w-xs italic leading-relaxed">
                                            Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên tại quầy thu ngân để đổi quà.
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-500 text-sm max-w-xs italic leading-relaxed">
                                        Vui lòng liên hệ nhân viên để nhận quà.
                                    </p>
                                )}
                            </div>
                            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
                        </div>

                        <button
                            onClick={onClose}
                            className="mt-10 group relative w-full md:w-auto bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-400 text-[#7B0F0F] font-bold text-lg py-5 px-12 rounded-full shadow-[0_4px_14px_0_rgba(255,215,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,215,0,0.23)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden cursor-pointer"
                        >
                            <span className="relative z-10 uppercase tracking-widest flex items-center justify-center gap-2">
                                Xác nhận & Hoàn tất
                                <span className="material-symbols-outlined text-xl">check_circle</span>
                            </span>
                            <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

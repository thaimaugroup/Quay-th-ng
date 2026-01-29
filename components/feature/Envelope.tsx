"use client";

import { motion } from "framer-motion";

interface EnvelopeProps {
    onClick: () => void;
    disabled: boolean;
}

export default function Envelope({ onClick, disabled }: EnvelopeProps) {
    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-80 md:w-96 mx-auto ${disabled ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}`}
            onClick={!disabled ? onClick : undefined}
        >
            {/* Glow effect behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-yellow-500/30 rounded-full blur-2xl animate-pulse-glow"></div>

            <div className="bao-li-xi">
                <div className="envelope-top">
                    <div className="w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] absolute top-0 left-0"></div>
                </div>

                <div className="coin-seal transition-transform duration-300">
                    <div className="coin-inner-ring"></div>
                    <span>MỞ</span>
                </div>

                <div className="flex-grow flex flex-col items-center justify-end pb-8 relative h-full">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
                    <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mb-2"></div>

                    <div className="text-tet-gold text-3xl tracking-[0.2em] font-display font-bold uppercase text-center drop-shadow-md z-10 leading-tight">
                        Phát<br />Lộc
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

"use client";

import { useState } from "react";
import StaffInput from "@/components/feature/StaffInput";
import Envelope from "@/components/feature/Envelope";
import GiftModal from "@/components/feature/GiftModal";
import { claimReward } from "@/lib/api";
import { CustomerInfo, GiftResult } from "@/types";

type GameState = "INPUT" | "GAME";

export default function Home() {
    const [gameState, setGameState] = useState<GameState>("INPUT");
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [turns, setTurns] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Helpers for Result Modal
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // New state
    const [lastResult, setLastResult] = useState<GiftResult | null>(null);

    const handleStart = (info: CustomerInfo, calculatedTurns: number) => {
        setCustomerInfo(info);
        setTurns(calculatedTurns);
        setGameState("GAME");
    };

    const handleOpenEnvelope = async () => {
        if (!customerInfo || turns <= 0 || isProcessing) return;

        setIsProcessing(true);

        // Call API
        const response = await claimReward(customerInfo);

        setIsProcessing(false);

        if (response.status === 'success') {
            const result: GiftResult = {
                name: response.giftName || "Chúc bạn may mắn lần sau",
                code: response.voucherCode || null,
                type: response.voucherCode ? 'voucher' : 'item',
            };

            setLastResult(result);
            setShowModal(true);
            setTurns(prev => prev - 1);
        } else {
            alert("Có lỗi xảy ra: " + (response.error || "Vui lòng thử lại"));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (turns <= 0) {
            setShowConfirmModal(true); // Trigger custom modal
        }
    };

    const handleConfirmBack = () => {
        setShowConfirmModal(false);
        setGameState("INPUT");
        setCustomerInfo(null);
    };

    if (gameState === "INPUT") {
        return (
            <>
                <StaffInput onStart={handleStart} />
                <GiftModal
                    isOpen={showModal}
                    result={lastResult}
                    onClose={handleCloseModal}
                />
            </>
        );
    }

    return (
        <main className="min-h-screen bg-background-light relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Effects */}
            <div className="falling-leaves">
                <div className="leaf" style={{ left: '5%', animationDuration: '6s', animationDelay: '0s' }}></div>
                <div className="leaf" style={{ left: '15%', animationDuration: '9s', animationDelay: '2s' }}></div>
                <div className="leaf" style={{ left: '25%', animationDuration: '7s', animationDelay: '4s' }}></div>
                <div className="leaf" style={{ left: '35%', animationDuration: '11s', animationDelay: '1s' }}></div>
                <div className="leaf" style={{ left: '45%', animationDuration: '8s', animationDelay: '3s' }}></div>
                <div className="leaf" style={{ left: '55%', animationDuration: '10s', animationDelay: '5s' }}></div>
                <div className="leaf" style={{ left: '65%', animationDuration: '7s', animationDelay: '0s' }}></div>
                <div className="leaf" style={{ left: '75%', animationDuration: '12s', animationDelay: '6s' }}></div>
                <div className="leaf" style={{ left: '85%', animationDuration: '9s', animationDelay: '2s' }}></div>
                <div className="leaf" style={{ left: '95%', animationDuration: '13s', animationDelay: '4s' }}></div>
            </div>
            <div className="absolute inset-0 bg-[#7B0F0F] z-0"></div>
            <div className="absolute inset-0 opacity-10 bg-pattern pointer-events-none z-0 mix-blend-overlay"></div>
            <div className="absolute inset-0 opacity-20 bg-clouds bg-repeat pointer-events-none z-0 animate-float"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#990F0F] via-transparent to-black/60 pointer-events-none z-0"></div>

            {/* Lantern Decorations */}
            <div className="absolute top-0 left-[10%] z-20 animate-sway origin-top hidden md:block">
                <div className="lantern-string h-24"></div>
                <div className="lantern top-24">
                    <span className="text-yellow-400 text-xs font-bold">Tết</span>
                    <div className="tassel"></div>
                </div>
            </div>
            <div className="absolute top-0 right-[10%] z-20 animate-sway origin-top hidden md:block" style={{ animationDelay: '1s' }}>
                <div className="lantern-string h-32"></div>
                <div className="lantern top-32">
                    <span className="text-yellow-400 text-xs font-bold">Xuân</span>
                    <div className="tassel"></div>
                </div>
            </div>

            <div className="absolute top-0 left-[20%] z-10 scale-75 opacity-80 animate-sway origin-top hidden md:block" style={{ animationDelay: '0.5s' }}>
                <div className="lantern-string h-16"></div>
                <div className="lantern top-16"></div>
            </div>

            {/* Floral Decor */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-10 opacity-90 transition-transform hover:scale-105 duration-700">
                <img alt="Apricot Blossom decoration" className="w-full h-full object-cover object-bottom rounded-br-full drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsFTjSd3EBlFEe_1U_krLH0BdRnBz0hVFuICgGZpGznejTvAUhvOwLlmDobOflVn7LJJblPBc9SgtTWgi5yOEMF2ZP6U8qgPP5fIJN7K2WD9m-jU5-5eLLkfhmNlh__-6Wy8siqpPGKU2uk1vSUFHJYDItitE0CXdNwp_XLXpIKV2kyhgl5mxubQq17iZolrc6hFu_s03u25ozXq05KZ7XKLf9C09EEoGnEU2i-yaR3Hz3u2KmWE6335ZykIXwQfskCkYgOJYIJ98" style={{ maskImage: "radial-gradient(circle at top left, black 65%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle at top left, black 65%, transparent 100%)" }} />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 pointer-events-none z-10 opacity-90 transition-transform hover:scale-105 duration-700">
                <img alt="Peach Blossom decoration" className="w-full h-full object-cover object-bottom rounded-bl-full drop-shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRoNtkO9e2lLxWOgsB9h7LKaHlFQsE70oy-PrZEuxmLdW35GrqqJedNmOypv6AAZtl_3y6zS47EtiPkCFtd12o_NaxOkj9tfEn7NPTCXKWEV7qz7vuDu-Se8MQO1z3kZp1AJAVQhQRJ2t33BqVfJU2ufBIYXoiQyr6LwJg94Zn4zl5hLeDxWy_RGNXWBjqURAJ7ZCvWATm_QP6AVGwItVHmSOWYE3Ebwdjkw-tpV3g89RG1RIh4IT0vKKrBfBLji_nx_h1yqn5azw" style={{ maskImage: "radial-gradient(circle at top right, black 65%, transparent 100%)", WebkitMaskImage: "radial-gradient(circle at top right, black 65%, transparent 100%)", filter: "hue-rotate(-15deg) saturate(1.2)" }} />
            </div>

            {/* Header for Game Screen */}
            <div className="absolute top-8 z-30 text-center w-full">
                <h2 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-lg tracking-wide uppercase" style={{ textShadow: "0 4px 8px rgba(0,0,0,0.5)" }}>
                    Lì Xì May Mắn
                </h2>
                <p className="text-cream/90 font-light mt-2 tracking-widest text-sm uppercase">Chạm để mở quà đầu năm</p>
            </div>

            {/* Main Content Area */}
            <div className="relative z-30 w-full max-w-5xl mt-20 flex flex-col items-center">
                <div className="text-center mb-8">
                    <p className="text-cream text-lg">Khách hàng: <span className="font-bold text-tet-gold">{customerInfo?.hoTen}</span></p>
                    <p className="text-cream text-lg">Bạn còn: <span className="font-bold text-3xl text-tet-gold">{turns}</span> lượt</p>
                </div>

                <div className="py-8">
                    <Envelope
                        onClick={handleOpenEnvelope}
                        disabled={isProcessing}
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="absolute bottom-2 left-0 w-full text-center z-20 opacity-90 flex flex-col items-center">
                <img src="/logo.png" alt="Company Logo" className="w-20 md:w-28 mb-1 drop-shadow-xl brightness-125 contrast-125 opacity-90 hover:opacity-100 transition-opacity" />
                <div className="flex justify-center items-center gap-2 text-cream/70 text-[10px] md:text-xs uppercase tracking-widest mb-1">
                    <span>An Khang</span> • <span>Thịnh Vượng</span>
                </div>
                <p className="text-cream/50 text-[10px] font-light">© 2024 Lunar New Year Campaign</p>
            </footer>

            {/* Wave Bottom */}
            <div className="absolute bottom-0 left-0 w-full pointer-events-none z-10 text-black/20">
                <svg className="w-full h-auto" height="150" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="currentColor" fillOpacity="1"></path>
                </svg>
            </div>

            {/* Result Modal */}
            <GiftModal
                isOpen={showModal}
                result={lastResult}
                onClose={handleCloseModal}
            />

            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-md bg-cream rounded-2xl shadow-2xl border-4 border-tet-gold p-6 md:p-8 text-center animate-scale-up">
                        {/* Decorative Borders */}
                        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-tet-red rounded-tl-lg"></div>
                        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-tet-red rounded-tr-lg"></div>
                        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-tet-red rounded-bl-lg"></div>
                        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-tet-red rounded-br-lg"></div>

                        <div className="mb-6">
                            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-3xl text-tet-red">priority_high</span>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-tet-red mb-2 uppercase">Thông Báo</h3>
                            <p className="text-gray-700 font-medium">Bạn đã hết lượt quay.<br />Quay về màn hình nhập liệu?</p>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-100 transition-colors"
                            >
                                Ở Lại
                            </button>
                            <button
                                onClick={handleConfirmBack}
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-tet-red to-red-700 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Đồng Ý
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main >
    );
}

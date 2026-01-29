"use client";

import Envelope from "./Envelope";

interface LuckyGridProps {
    totalItems?: number; // Just for visual density, logic might use turns
    onOpenEnvelope: () => void;
    isProcessing: boolean;
}

export default function LuckyGrid({ totalItems = 6, onOpenEnvelope, isProcessing }: LuckyGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 max-w-4xl mx-auto">
            {Array.from({ length: totalItems }).map((_, i) => (
                <Envelope
                    key={i}
                    index={i}
                    onOpen={onOpenEnvelope}
                    disabled={isProcessing}
                />
            ))}
        </div>
    );
}

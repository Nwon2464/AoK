import React, { useEffect, useState, memo } from "react";
import { useSwiperSlide } from "swiper/react";
import CarouselBody from "./CarouselBody";

const SlideItem = ({ stream, delayMs = 5000, leftSize, parents = [] }) => {
    const { isActive } = useSwiperSlide();
    const [showVideo, setShowVideo] = useState(false);

    // 활성화될 때만 5초 후 iframe 표시, 비활성화되면 즉시 이미지로 복귀
    useEffect(() => {
        let t;
        if (isActive) {
            setShowVideo(false);
            t = setTimeout(() => setShowVideo(true), delayMs);
        } else {
            setShowVideo(false);
        }
        return () => t && clearTimeout(t);
    }, [isActive, stream?.user_name, delayMs]);

    // Twitch embed URL 구성 (parent 파라미터 필수)
    const parentParams = parents.map((p) => `parent=${encodeURIComponent(p)}`).join("&");
    const embedSrc = `https://player.twitch.tv/?channel=${stream.user_name}&muted=true&${parentParams}`;

    const leftW = `${leftSize.width}px`;
    const leftH = `${leftSize.height}px`;

    return (
        <div
            className="twitch-slide"
            style={{ display: "flex", gap: 12, alignItems: "stretch", width: "100%" }}
        >
            {/* 왼쪽: 활성 슬라이드면 5초 후 iframe, 비활성 슬라이드는 항상 이미지 */}
            <div style={{ width: leftW, height: leftH, flex: `0 0 ${leftW}` }}>
                {isActive && showVideo ? (
                    <iframe
                        title={`twitch-${stream.user_name}`}
                        width={leftSize.width}
                        height={leftSize.height}
                        src={embedSrc}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        loading="lazy"
                    />
                ) : (
                    <img
                        src={stream.thumbnail_url.replace("440x248", "800x248")}
                        alt={`${stream.user_name} thumbnail`}
                        width={leftSize.width}
                        height={leftSize.height}
                        loading="lazy"
                        style={{ objectFit: "cover", display: "block" }}
                    />
                )}
            </div>

            {/* 오른쪽: 정보 패널(항상 표시) */}
            <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                <CarouselBody streams={stream} />
            </div>
        </div>
    );
};

export default memo(SlideItem);
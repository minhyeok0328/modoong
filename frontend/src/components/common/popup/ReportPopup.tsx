import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtom } from 'jotai';
import { reportPopupStateAtom, reportFormAtom, reportsAtom, defaultReportData, ReportData } from '@/atoms/report';
import { Button, Input, Checkbox } from '@/components/common';
import { FaTimes, FaCamera } from 'react-icons/fa';
import { saveImageToIDB, getImageFromIDB } from '@/utils/indexedDB';

export default function ReportPopup() {
    const [popupState, setPopupState] = useAtom(reportPopupStateAtom);
    const [form, setForm] = useAtom(reportFormAtom);
    const [reports, setReports] = useAtom(reportsAtom);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (popupState.isOpen && popupState.facilityId) {
            const existingReport = reports[popupState.facilityId];
            if (existingReport) {
                setForm({ ...existingReport, facilityId: popupState.facilityId });
                // Load image from IDB
                if (existingReport.hasEntrancePhoto) {
                    getImageFromIDB(popupState.facilityId).then((img) => {
                        setPreviewImage(img);
                    });
                } else {
                    setPreviewImage(null);
                }
            } else {
                setForm({
                    facilityId: popupState.facilityId,
                    ...defaultReportData,
                });
                setPreviewImage(null);
            }
        }
    }, [popupState.isOpen, popupState.facilityId, reports, setForm]);

    const handleClose = () => {
        setPopupState({ ...popupState, isOpen: false });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // 1.5s animation delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const facilityId = popupState.facilityId!;

        // Save image to IDB if exists
        if (previewImage) {
            await saveImageToIDB(facilityId, previewImage);
        }

        // Save report to LocalStorage (via atom)
        const newReport: ReportData = {
            ...form,
            hasEntrancePhoto: !!previewImage,
        };

        setReports((prev) => ({
            ...prev,
            [facilityId]: newReport,
        }));

        setIsSubmitting(false);
        handleClose();
    };

    if (!popupState.isOpen) return null;

    if (!popupState.isOpen) return null;

    const content = isSubmitting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl">
                <h2 className="text-xl font-bold mb-2 animate-pulse">제보하는 중...</h2>
                <p className="text-gray-600 mb-6 animate-bounce">잠시만 기다려주세요!</p>

                <div className="flex justify-center items-center space-x-2 mb-6">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>

                <div className="w-12 h-12 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
            </div>
        </div>
    ) : (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-8">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[calc(100vh-10rem)] flex flex-col shadow-xl animate-fade-in-up">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold">시설 정보 제보하기</h2>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-1">
                    {/* Facility Basic Info */}
                    <section className="mb-8">
                        <h3 className="font-bold text-lg mb-4">시설 기본 정보</h3>
                        <div className="flex flex-col gap-4">
                            <Input label="위치" name="location" value={form.location} onChange={handleChange} placeholder="위치를 입력해주세요" />
                            <Input label="시설 유형" name="facilityType" value={form.facilityType} onChange={handleChange} placeholder="시설 유형을 입력해주세요" />
                            <div className="flex gap-2">
                                <Input label="운영시간(시작)" name="operatingHoursStart" value={form.operatingHoursStart} onChange={handleChange} placeholder="HH:MM" />
                                <Input label="운영시간(종료)" name="operatingHoursEnd" value={form.operatingHoursEnd} onChange={handleChange} placeholder="HH:MM" />
                            </div>
                            <Input label="운영일" name="operatingDays" value={form.operatingDays} onChange={handleChange} placeholder="예: 월~금" />
                            <Input label="요금" name="fee" value={form.fee} onChange={handleChange} placeholder="요금 정보를 입력해주세요" />
                            <Input label="할인제도" name="discount" value={form.discount} onChange={handleChange} placeholder="할인 정보를 입력해주세요" />
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-700">시설 공지</label>
                                <textarea
                                    name="notice"
                                    value={form.notice}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors resize-none h-24"
                                    placeholder="시설 공지사항을 입력해주세요"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Accessibility Info */}
                    <section>
                        <h3 className="font-bold text-lg mb-4">접근성 정보</h3>
                        <div className="flex flex-col gap-4">
                            {/* Stair Height */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">계단 높이</label>
                                <select
                                    name="stairHeight"
                                    value={form.stairHeight}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="10cm 미만">10cm 미만</option>
                                    <option value="한뼘">한뼘</option>
                                    <option value="반뼘">반뼘</option>
                                    <option value="기타">기타</option>
                                </select>
                            </div>

                            {/* Stair Count */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">계단 숫자</label>
                                <select
                                    name="stairCount"
                                    value={form.stairCount}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="3개 미만">3개 미만</option>
                                    <option value="6개 미만">6개 미만</option>
                                    <option value="10개 미만">10개 미만</option>
                                    <option value="10개 이상">10개 이상</option>
                                </select>
                            </div>

                            {/* Entrance Photo */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-gray-700">입구 사진</label>
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-400 transition-colors bg-gray-50 h-40"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewImage ? (
                                        <img src={previewImage} alt="Preview" className="h-full object-contain" />
                                    ) : (
                                        <>
                                            <FaCamera className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">사진을 등록해주세요</span>
                                        </>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <Checkbox name="disabledToilet" label="장애인 화장실" checked={form.disabledToilet} onChange={handleCheckboxChange} />
                                <Checkbox name="disabledParking" label="장애인 주차장" checked={form.disabledParking} onChange={handleCheckboxChange} />
                                <Checkbox name="elevator" label="엘리베이터" checked={form.elevator} onChange={handleCheckboxChange} />
                                <Checkbox name="ramp" label="경사로" checked={form.ramp} onChange={handleCheckboxChange} />
                                <Checkbox name="wheelchairRental" label="휠체어 대여" checked={form.wheelchairRental} onChange={handleCheckboxChange} />
                                <Checkbox name="brailleSign" label="점자 안내판" checked={form.brailleSign} onChange={handleCheckboxChange} />
                                <Checkbox name="audioGuide" label="음성 안내 장치" checked={form.audioGuide} onChange={handleCheckboxChange} />
                            </div>

                            {/* Other Accessibility */}
                            <Input label="기타 접근성 시설" name="otherAccessibility" value={form.otherAccessibility} onChange={handleChange} placeholder="직접 입력해주세요" />
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                    <Button fullWidth onClick={handleSubmit} disabled={isSubmitting}>
                        제보하기
                    </Button>
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
}

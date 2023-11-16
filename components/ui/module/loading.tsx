import { Label } from "@/components/ui/label"
export default function Loading() {
    return (
        <div className="flex flex-col space-y-4 justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            <Label>Đang tải dữ liệu</Label>
        </div>
    )
}
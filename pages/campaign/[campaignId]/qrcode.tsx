import Layout from "@/components/ui/module/layout";
import { Label } from "@/components/ui/label";
import FilterQR from "@/components/ui/module/filter/campaign/qrcode";

export default function QRcode({ campaignId }: { campaignId: string }) {
    return (
        <Layout
            pageInfo={{
                title: "Danh sách QR CODE",
                description: "Tạo, chỉnh sửa, quản lý QR Code."
            }}
        >
            <FilterQR campaignId={campaignId} />
        </Layout>
    )
}

export async function getServerSideProps(context: any) {
    const {
        campaignId,
    } = context.params;

    return {
        props: {
            campaignId
        }, // will be passed to the page component as props
    }
}



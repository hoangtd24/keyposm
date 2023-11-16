import Layout from "@/components/ui/module/layout";
import FilterCampaignUserSales from "@/components/ui/module/filter/sales";


export default function UserSales({ campaignId }: { campaignId: string }) {
    return (
        <Layout
            pageInfo={{
                title: "Danh sách nhân viên bán hàng",
                description: "Tạo, chỉnh sửa, quản lý nhân viên bán hàng.",
            }}
        >
            <FilterCampaignUserSales campaignId={campaignId} />
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

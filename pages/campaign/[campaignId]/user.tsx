import Layout from "@/components/ui/module/layout";
import FilterCampaignUser from "@/components/ui/module/filter/campaign/user";


export default function User({ campaignId }: { campaignId: string }) {
    return (
        <Layout
            pageInfo={{
                title: "Danh sách tài khoản",
                description: "Tạo, chỉnh sửa, quản lý tài khoản.",
            }}
        >
            <FilterCampaignUser campaignId={campaignId} />
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

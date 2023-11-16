import Layout from "@/components/ui/module/layout";
import FilterBrand from "@/components/ui/module/filter/brand";
export default function Brand() {
    return (
        <Layout pageInfo={{
            title: "Danh sách thương hiệu",
            description: "Tạo, chỉnh sửa, quản lý thương hiệu của bạn.",
        }}>
            <FilterBrand />
        </Layout>
    )
}
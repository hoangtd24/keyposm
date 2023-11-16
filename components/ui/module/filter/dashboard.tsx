"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sliders, Users, Book, Store } from "lucide-react";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState, useEffect } from "react";
import _ from "lodash";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import { useToast } from "@/components/ui/use-toast";
import moment from "moment";
import {
  NEXT_PUBLIC_MAPS_CAMPAIGN
} from "@/config/api";
import MapLocation from "@/components/ui/module/maps";
import { PagingOptions } from 'ka-table/models';
import { defaultPaging } from '@/config';
import {
  ChannelCombobox,
  DistrictCombobox,
  ProvinceCombobox,
  AreaCombobox
} from "@/components/ui/module/combobox";
import { Label } from "@/components/ui/label"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { numberWithCommas } from "@/lib/function"

export default function FilterDashboard({ campaignId }: { campaignId: string }) {
  const { toast } = useToast();
  const { collapsed } = useAppSelector((state: any) => state.menu);
  const { listDropdownArea } = useAppSelector((state) => state.area);
  const { listDropdownChannel } = useAppSelector((state) => state.channel);

  const [loading, setLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [provinceCode, setProvinceCode] = useState<string>("");
  //update table
  const [data, setData] = useState<any>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [paging, setPaging] = useState<PagingOptions>(defaultPaging);

  //update filter
  const [loadingArea, setLoadingArea] = useState<boolean>(false);
  const [loadingChannel, setLoadingChannel] = useState<boolean>(false);

  const [openFilterDeploy, setOpenFilterDeploy] = useState<boolean>(false);
  const [changeFilterDeploy, setChangeFilterDeploy] = useState<boolean>(false);
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);

  //total 
  const [totaluser, setTotalUser] = useState<number>(0);
  const [totalLocation, setTotalLocation] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    setMenuCollapsed(collapsed)
  }, [collapsed])

  const formSchema = z.object({
    search: z.string(),
    // offset: z.number(),
    // limit: z.number(),
    province: z.string(),
    district: z.string(),
    // brandId: z.string().default("0"),
    campaignId: z.string().default("0").optional(),
    areaId: z.string().default("0"),
    channelId: z.string().default("0"),
    locationIds: z.array(z.number()).default([]),
    userIds: z.array(z.number()).default([]),
  });

  useEffect(() => {
    onSubmit({
      search: "",
      // offset: 0,
      // limit: 50,
      province: "",
      district: "",
      areaId: "0",
      channelId: "0",
      locationIds: [],
      userIds: []
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentTime && currentTime > 0) {
      console.count();
      onSubmit({
        // offset: 0,
        // limit: 50,
        search: form.getValues("search"),
        province: form.getValues("province"),
        district: form.getValues("district"),
        areaId: form.getValues("areaId"),
        channelId: form.getValues("channelId"),
        locationIds: form.getValues("locationIds"),
        userIds: form.getValues("userIds")
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
      // offset: 0,
      // limit: 50,
      province: "",
      district: "",
      areaId: "0",
      channelId: "0",
      locationIds: [],
      userIds: []
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    let objSearch: any = _.cloneDeep(values);

    setLoading(true);
    // objSearch.areaId = objSearch.areaId === "0" ? null : objSearch.areaId;
    // objSearch.channelId = objSearch.channelId === "0" ? null : objSearch.channelId;
    objSearch.campaignId = campaignId;
    console.log(objSearch);

    axiosWithHeaders("post", NEXT_PUBLIC_MAPS_CAMPAIGN, objSearch)
      .then((response: any) => {
        if (response && response.status === enums.STATUS_RESPONSE_OK) {
          const { result, summary, status, message } = response.data;

          if (status === enums.STATUS_RESPONSE_OK) {
            console.log(result, summary)
            if (summary) {
              const {
                totaluser,
                totalLocation,
                total
              } = summary;
              setTotal(total);
              setTotalLocation(totalLocation);
              setTotalUser(totaluser);
            }

            let listMarker = _.cloneDeep(result);
            let lng = 0;
            let lat = 0;

            listMarker.map((item: any) => {
              item.position = item.location.split(",").map((item: any) => {
                return parseFloat(item)
              })

              lng += item.position[0];
              lat += item.position[1];
            });

            let objMaps = {
              center: [lng === 0 ? 0 : lng / listMarker.length, lat === 0 ? 0 : lat / listMarker.length],
              markers: listMarker
            }

            console.log(objMaps);

            setData(objMaps);
            // let dataTable = _.cloneDeep(result);
            // dataTable.map((item: any, index: number) => {
            //   item.no = index + 1;
            // });
            // setData(dataTable);
            // setPaging({
            //   ...paging,
            //   pageIndex: (objSearch.offset / objSearch.limit),
            //   pageSize: objSearch.limit,
            //   pagesCount: Math.ceil(total / objSearch.limit),
            // });
            // setTotalRows(total);
          } else {
            toast({
              title: "Lỗi",
              description: message,
            });
          }
        }
      })
      .catch((error: any) => {
        toast({
          title: "Lỗi",
          description: error.toString(),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChangeTablePage = (pageIndex: number, pageSize: number) => {
    // let offset = pageIndex ? pageSize * (pageIndex) : 0;

    onSubmit({
      search: form.getValues("search"),
      // offset: offset,
      // limit: pageSize ? pageSize : 50,
      province: form.getValues("province"),
      district: form.getValues("district"),
      areaId: form.getValues("areaId"),
      channelId: form.getValues("channelId"),
      locationIds: form.getValues("locationIds"),
      userIds: form.getValues("userIds")
    });
  };

  const onRefreshData = () => {
    setCurrentTime(moment().valueOf());
  };

  return (
    <>
      <Card className="border-none shadow-none bg-muted md:bg-background">
        <CardContent className="p-2 pt-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex space-x-3 md:space-x-2 md:mt-2 w-full"
            >
              <div className="flex flex-1 md:hidden">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Từ khóa</FormLabel>
                      <FormControl>
                        <div className="px-0 relative group">
                          <Input
                            {...field}
                            className="w-full px-9"
                            placeholder="Tìm kiếm lắp đặt..."
                          />
                          <Button
                            size={`icon`}
                            className="absolute top-0 left-0 bg-transparent hover:bg-transparent border-none pointer-events-none group-hover:border-accent"
                          >
                            <Search className="text-foreground w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                          <Button
                            onClick={() => setOpenFilterDeploy(true)}
                            size={`icon`}
                            variant={`ghost`}
                            type="button"
                            className={
                              cn(
                                "md:hidden absolute top-0 right-0",
                                changeFilterDeploy && "text-destructive"
                              )
                            }
                          >
                            <Sliders />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="hidden md:flex space-x-2">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="w-[300px]">
                      <FormLabel>Từ khóa</FormLabel>
                      <FormControl>
                        <div className="px-0 relative group">
                          <Input
                            {...field}
                            className="w-full px-9"
                            placeholder="Tìm kiếm lắp đặt..."
                          />
                          <Button
                            size={`icon`}
                            className="absolute top-0 left-0 bg-transparent hover:bg-transparent border-none pointer-events-none group-hover:border-accent"
                          >
                            <Search className="text-foreground w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="channelId"
                  render={({ field }) => (
                    <FormItem className={
                      cn(
                        "w-[230px] hidden",
                        menuCollapsed ? "2xl:block" : "xl:hidden 3xl:block",
                      )
                    }>
                      <FormLabel>Kênh</FormLabel>
                      <ChannelCombobox
                        data={listDropdownChannel}
                        value={field.value}
                        onChange={(value: string) => {
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="areaId"
                  render={({ field }) => (
                    <FormItem className={
                      cn(
                        "w-[230px] hidden",
                        menuCollapsed ? "2xl:block" : "xl:hidden 3xl:block",
                      )
                    }>
                      <FormLabel>Vùng</FormLabel>
                      <AreaCombobox
                        data={listDropdownArea}
                        value={field.value}
                        onChange={(value: string) => {
                          // console.log(value, provinceCode)
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className={
                      cn(
                        "w-[230px] hidden ",
                        menuCollapsed ? "4xl:block" : "5xl:block",
                      )
                    }>
                      <FormLabel>Tỉnh/Thành</FormLabel>
                      <ProvinceCombobox
                        value={field.value}
                        onChange={(value: string, provinceCode: string) => {
                          // console.log(value, provinceCode)
                          setProvinceCode(provinceCode);
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem className={
                      cn(
                        "w-[230px] hidden ",
                        menuCollapsed ? "4xl:block" : "5xl:block",
                      )
                    }>
                      <FormLabel>Quận/Huyện</FormLabel>
                      <DistrictCombobox
                        value={field.value}
                        provinceCode={provinceCode}
                        onChange={(value: string) => {
                          field.onChange(value);
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className={
                  cn(
                    "h-auto flex items-end 4xl:hidden",
                  )
                }>
                  <span></span>
                  <Button
                    onClick={() => setOpenFilterDeploy(true)}
                    size={`icon`}
                    variant={`outline`}
                    type="button"
                  >
                    <Sliders />
                  </Button>
                </div>
              </div>
              <div className="h-auto flex items-end">
                <span></span>
                <Button type="submit" disabled={loading || loadingArea || loadingChannel}>
                  Tìm kiếm
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
        <div>
          <Card>
            <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
              <div className="flex items-center w-full">
                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                  <Users className="w-10 h-10 lg:w-12 lg:h-12" />
                </div>
                <div className="flex-1 space-y-2 flex flex-col">
                  <Label className="text-xs lg:text-lg">Số lượng nhân viên</Label>
                  <Label className="text-lg lg:text-xl font-bold">{totaluser ? numberWithCommas(totaluser) : 0}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
              <div className="flex items-center w-full">
                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                  <Store className="w-10 h-10 lg:w-12 lg:h-12" />
                </div>
                <div className="flex-1 space-y-2 flex flex-col">
                  <Label className="text-xs lg:text-lg">Số lượng địa điểm</Label>
                  <Label className="text-lg lg:text-xl font-bold">{totalLocation ? numberWithCommas(totalLocation) : 0}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="lg:min-h-[100px] p-0 w-full relative flex items-center">
              <div className="flex items-center w-full">
                <div className="w-16 lg:w-20 aspect-square flex justify-center items-center">
                  <Book className="w-10 h-10 lg:w-12 lg:h-12" />
                </div>
                <div className="flex-1 space-y-2 flex flex-col">
                  <Label className="text-xs lg:text-lg">Số lượng POSM</Label>
                  <Label className="text-lg lg:text-xl font-bold">{total ? numberWithCommas(total) : 0}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MapLocation
        data={data}
      />
      {/* <TableDeployCampaign
        data={data}
        loading={loading}
        campaignId={campaignId}
        totalRows={totalRows}
        paging={paging}
        onChangeTablePage={(pageIndex: number, pageSize: number) =>
          onChangeTablePage(pageIndex, pageSize)
        }
        onRefresh={onRefreshData}
      /> */}

      <Sheet open={openFilterDeploy} onOpenChange={() => setOpenFilterDeploy(false)}>
        <SheetContent className="w-full sm:max-w-[400px] px-4 sm:px-2 space-x-0 p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
              <SheetHeader className="flex justify-start px-3 mb-2 mt-2">
                <SheetTitle className="flex justify-start">Tìm kiếm nâng cao</SheetTitle>
              </SheetHeader>
              <ScrollArea className="w-full h-[calc(100vh-50px)] pl-0 px-3">
                <div className="w-full px-1">
                  <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Từ khóa</FormLabel>
                        <FormControl>
                          <div className="px-0 relative group">
                            <Input
                              {...field}
                              className="w-full px-9"
                              placeholder="Tìm kiếm lắp đặt..."
                            />
                            <Button
                              size={`icon`}
                              className="absolute top-0 left-0 bg-transparent hover:bg-transparent border-none pointer-events-none group-hover:border-accent"
                            >
                              <Search className="text-foreground w-4 h-4 md:w-5 md:h-5" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="channelId"
                    render={({ field }) => (
                      <FormItem className="pt-1.5">
                        <FormLabel>Kênh</FormLabel>
                        <ChannelCombobox
                          data={listDropdownChannel}
                          value={field.value}
                          onChange={(value: string) => {
                            field.onChange(value);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="areaId"
                    render={({ field }) => (
                      <FormItem className="pt-1.5">
                        <FormLabel>Vùng</FormLabel>
                        <AreaCombobox
                          data={listDropdownArea}
                          value={field.value}
                          onChange={(value: string) => {
                            field.onChange(value);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem className="pt-1.5">
                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                        <ProvinceCombobox
                          value={field.value}
                          onChange={(value: string, provinceCode: string) => {
                            // console.log(value, provinceCode)
                            setProvinceCode(provinceCode);
                            if (provinceCode !== "") {
                              setChangeFilterDeploy(true);
                            }
                            field.onChange(value);
                          }}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem className="pt-1.5">
                        <FormLabel>Quận/Huyện</FormLabel>
                        <DistrictCombobox
                          value={field.value}
                          provinceCode={provinceCode}
                          onChange={(value: string) => {
                            field.onChange(value);
                          }}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <SheetFooter className="flex items-end mt-2">
                    <div>&nbsp;</div>
                    <div>
                      <SheetClose asChild >
                        <Button type="submit" disabled={loading || loadingArea || loadingChannel}>
                          Tìm kiếm
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetFooter>
                </div>
              </ScrollArea>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}

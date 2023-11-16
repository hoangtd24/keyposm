"use client";
import { useState, useEffect } from "react";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import moment from "moment";
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });



export default function StackColumn({ data, campaignId }: { data: [], campaignId: string }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { dataBrand } = useAppSelector((state) => state.brand);
  const { listTempChannel } = useAppSelector((state) => state.channel);
  const [loading, setLoading] = useState(true);
  const [options, setOption] = useState<any>({
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      // events: {
      //   dataPointSelection: (event:any, chartContext:any, config:any) => { 
      //       console.log(config,chartContext,event)
      //       console.log(config.dataPointIndex)
      //       console.log(data[config.dataPointIndex])
      //       let area = data[config.dataPointIndex] as any
      //       router.push(`/campaign/${campaignId}/location?areaId=${area.areaId}`);
      //     }

      //   }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      categories: ["A", "B"],
    },
    legend: {
      position: 'right',
      offsetY: 40
    },
    fill: {
      opacity: 1
    },
    // title: {
    //     text: `BIỂU ĐỒ SỐ LƯỢNG THEO VÙNG`,
    //     floating: true,
    //     offsetY: 330,
    //     align: 'center',
    //     style: {
    //       color: '#444'
    //     }
    //   }

  });
  const [series, setSeries] = useState<any>([{
    name: 'ĐÃ GIAO',
    data: [0]
  }]);

  useEffect(() => {
    if (data != undefined && data != null && data.length > 0) {
      let categories = [] as any
      data.map((user: any) => categories.push(user.areaName))
      setOption({
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          toolbar: {
            show: false
          },
          events: {
            dataPointSelection: (event: any, chartContext: any, config: any) => {
              console.log(config, chartContext, event)
              console.log(config.dataPointIndex)
              console.log(data[config.dataPointIndex])
              let area = data[config.dataPointIndex] as any
              router.push(`/campaign/${campaignId}/location?areaId=${area.areaId}`);
            }

          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
            columnWidth: '40%',
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        xaxis: {
          categories: categories,
        },
        legend: {
          position: 'bottom',
          //  offsetY: 40
        },
        fill: {
          opacity: 1
        },
        // title: {
        //     text: `BIỂU ĐỒ SỐ LƯỢNG THEO VÙNG`,
        //     align: 'center',
        //     floating: true,
        //     margin:30,
        //     style: {
        //       color: '#444',
        //       fontWeight:  'bold',
        //       fontFamily:  'Arial',

        //     }
        //   }
      })

      let totals = [] as any
      data.map((user: any) => totals.push(user.total - user.totaltransaction))
      let totalTransactions = [] as any
      data.map((user: any) => totalTransactions.push(user.totaltransaction))
      setSeries([{
        name: 'ĐÃ GIAO',
        data: totalTransactions
      }, {
        name: 'CHƯA GIAO',
        data: totals
      }])
      setLoading(false)

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);


  return (
    <div className="w-full">
      <div className="w-full text-center font-bold p-3"><p className="">BIỂU ĐỒ SỐ LƯỢNG THEO VÙNG</p></div>
      {(typeof window !== 'undefined') &&
        <ReactApexChart options={options} series={series} type="bar" height={400} />
      }

    </div>

  )
}
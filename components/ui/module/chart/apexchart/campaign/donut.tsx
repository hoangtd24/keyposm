"use client";
import { useState, useEffect } from "react";

import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";

import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function Donut({ data, className }: { data: any, className: string }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [options, setOption] = useState<any>({
    chart: {
      type: 'donut',
    },
    labels: ['ĐÃ GIAO', 'CHƯA GIAO'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });
  const [series, setSeries] = useState<any>([0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data != undefined && data != null) {
      let categories = [] as any
      setOption({
        chart: {
          type: 'donut',

        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  label: 'Tổng số',
                  showAlways: true,
                  show: true
                }
              }
            }
          }
        },
        labels: ['ĐÃ GIAO', 'CHƯA GIAO'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      })

      let series = [data?.totaltransaction, (data.total - data.totaltransaction)]
      //  console.log(series)
      setSeries(series)
      setLoading(false)
    }
 // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (

    <div className={className}>
      <div className="w-full text-center font-bold"><p className="">BIỂU ĐỒ SỐ LƯỢNG THEO KÊNH {data.channelName}</p></div>
      {(typeof window !== 'undefined') &&
        <ReactApexChart options={options} series={series} type="donut" />
      }
    </div>


  )
}
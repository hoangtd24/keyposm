"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { axiosWithHeaders } from "@/lib/axiosWrapper";
import * as enums from "@/lib/enums";
import _ from "lodash"
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setTableTimeStamp } from "@/lib/store/slices/tableSlice";
import moment from "moment";
import { AreaItem } from "@/lib/store/slices/areaSlice";
import { ChannelItem, setTempChannelData } from "@/lib/store/slices/channelSlice";
import { NEXT_PUBLIC_CREATE_CAMPAIGN_API } from "@/config/api";
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
type CreateCampaignProps = {
  campaignName: string;
  campaignDescription: string;
  brandId: string;
  isChannel?: boolean;
  isArea?: boolean;
  qrcode: {
    size: string;
  },
  channels?: ChannelItem[] | [],
  areas?: AreaItem[] | []
}

export default function SparkLine({ data, className, title, subtitle, colors, labels }: { data: any, className: string, title: string, subtitle: string, colors: Array<string>, labels: Array<string> }) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [options, setOption] = useState<any>({});
  const [series, setSeries] = useState<any>([0, 0]);
  const [loading, setLoading] = useState(true);

  const randomizeArray = function (arg: any) {
    var array = arg.slice();
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  useEffect(() => {
    var sparklineData = [0];
    // var colorPalette = ['#00D8B6','#008FFB',  '#FEB019', '#FF4560', '#775DD0']

    setOption({
      chart: {
        type: 'area',
        height: 200,
        sparkline: {
          enabled: true
        },
      },
      stroke: {
        curve: 'straight'
      },
      fill: {
        opacity: 0.3
      },
      // xaxis: {
      //   crosshairs: {
      //     width: 1
      //   },
      // },
      // yaxis: {
      //   min: 0
      // },
      colors: colors,
      title: {
        text: title,
        offsetX: 0,
        style: {
          fontSize: '24px',
        }
      },
      subtitle: {
        text: subtitle,
        offsetX: 0,
        style: {
          fontSize: '14px',
        }
      },
      labels: labels,
    })
    let series = [{
      name: 'Số lượng',
      data: data != undefined && data != null ? data : randomizeArray(sparklineData)
    }]

    setSeries(series)
    setLoading(false)

 // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle, labels, data, colors]);

  return (
    <div className={className}>
      <div className="w-full">
        {/* {JSON.stringify(series)}
              {title}
              {subtitle}
              {labels} */}
        {(typeof window !== 'undefined') && !loading &&
          <ReactApexChart options={options} series={series} type="area" height={200} width={`100%`}/>
        }
      </div>
    </div>



  )
}
"use client";
import { Table } from 'ka-table';
import { Column, PagingOptions } from 'ka-table/models';
import { PagingPosition } from 'ka-table/enums';
import { IPagingProps } from "ka-table/props";
import { Label } from '@/components/ui/label';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import EmptyAnimation from "@/components/ui/module/animate/empty";
// import { useAppSelector, useAppDispatch } from "@/lib/store";
import { cn } from '@/lib/utils';
import { defaultPaging } from '@/config';
import { Button } from '@/components/ui/button';

export type TableProps = {
    columns: Column[],
    rowKeyField: string,
    data?: any | [],
    headRow?: object | undefined,
    cell?: object | undefined,
    dataRow?: object | undefined,
    cellText?: object | undefined,
    tableWrapper?: object | undefined,
    headCell?: object | undefined,
    selectedRows?: number[] | undefined,
    loading?: boolean | undefined,
    // pageIndex?: number,
    // pageSize?: number,
    // pagesCount?: number,
    paging?: PagingOptions,
    //function
    onChangeTablePage?: (pageIndex: number, pageSize: number) => void,
}

export default function KaTable({
    columns,
    rowKeyField,
    data,
    headRow,
    cell,
    dataRow,
    cellText,
    headCell,
    loading,
    paging,
    selectedRows,
    tableWrapper,
    onChangeTablePage
}
    : TableProps) {
    // const { pageIndex, pageSize, pagesCount } = useAppSelector((state) => state.table);

    if (data.length === 0) {
        return (
            <div className="flex flex-col space-y-1 justify-center items-center h-80 bg-background rounded-md">
                <EmptyAnimation />
                <p className="text-gray-400">Không có dữ liệu</p>
            </div>
        )
    }

    return (
        <>
            <Table
                columns={columns}
                rowKeyField={rowKeyField}
                data={data}
                selectedRows={selectedRows}
                childComponents={{
                    headRow: typeof (headRow) === "object" ? headRow : {
                        elementAttributes: () => ({
                            className: "hidden lg:table-row bg-background"
                        }),
                        content: (props) => {
                            return (
                                <>
                                    {props.columns.map((column) => (
                                        <th key={column.key} className="ka-thead-cell ka-thead-cell-height ka-thead-fixed bg-foreground z-50" style={{ padding: `0px`, height: 40 }}>
                                            <div className="ka-thead-cell-wrapper">
                                                <div className="ka-thead-cell-content-wrapper">
                                                    <div className={
                                                        cn(
                                                            //default
                                                            "ka-thead-cell-content flex items-center text-background",
                                                            "px-2"
                                                        )
                                                    }>
                                                        {column.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </>
                            )
                        },
                    },
                    cell: typeof (cell) === "object" ? cell : undefined,
                    dataRow: typeof (dataRow) === "object" ? dataRow : {
                        content: (props: any) => {
                            return (
                                <>
                                    {props.columns.map((column: any) => (
                                        <td className="ka-cell" key={column.key} style={{ height: 40, padding: 0 }}>
                                            <div className={
                                                cn(
                                                    "ka-cell-text truncate relative h-full px-2",
                                                )
                                            }>
                                                {props.rowData[column.field]}
                                            </div>
                                        </td>
                                    ))}
                                </>
                            )
                        },
                    },
                    cellText: typeof (cellText) === "object" ? cellText : undefined,
                    headCell: typeof (headCell) === "object" ? headCell : undefined,
                    tableWrapper: typeof (tableWrapper) === "object" ? tableWrapper : {
                        elementAttributes: (props) => ({
                            // style: {
                            //     maxHeight: "calc(100vh - 340px)"
                            // },
                            className: "max-h-[calc(100vh-400px)]"
                        }),
                    },
                    pagingSizes: {
                        elementAttributes: (props) => ({
                            className: "px-0 mx-0",
                            style: {
                                padding: 0
                            }
                        }),
                        content: ({ pageSize, pageSizes }: IPagingProps) => {
                            // console.log(props)
                            return (
                                <>
                                    {pageSizes?.map((size) => (
                                        <li
                                            className={
                                                cn(
                                                    "ka-paging-size m-0 aspect-square hidden lg:block",
                                                    pageSize === size && "ka-paging-size-active",
                                                )
                                            }
                                            key={size}
                                            style={{
                                                minWidth: 32,
                                                minHeight: 32,
                                                // margin: 5
                                            }}
                                        >
                                            <button className='w-full h-full text-xs lg:text-sm' onClick={() => {
                                                // dispatch(setTablePageSize(size))
                                                // dispatch(setTablePageIndex(0))
                                                onChangeTablePage && onChangeTablePage(0, size);
                                            }} disabled={loading}>
                                                {size}
                                            </button>
                                        </li>
                                    ))}
                                    <div className='flex space-x-2 items-center px-3 py-2 lg:hidden'>
                                        <Label className="px-0 text-xs lg:text-sm sm: text-muted-foreground h-auto">Hiển thị</Label>
                                        <select
                                            className='w-12 h-7 border'
                                            value={pageSize}
                                            onChange={(event) => {
                                                // dispatch(updatePageSize(Number(event.currentTarget.value)));
                                                onChangeTablePage && onChangeTablePage(0, Number(event.currentTarget.value));
                                            }}>
                                            {
                                                pageSizes?.map((value) => (<option key={value} value={value}>{value}</option>))
                                            }
                                        </select>
                                        <Label className="px-0 text-xs lg:text-sm sm: text-muted-foreground h-auto">dòng</Label>
                                    </div>
                                </>
                            )
                        }
                    },
                    pagingPages: {
                        elementAttributes: (props) => ({
                            className: "px-0 mx-0",
                            style: {
                                padding: 0
                            }
                        }),
                        content: ({ pageIndex, pagesCount, pageSize }: IPagingProps) => {
                            let pageIndexText = (pageIndex ? pageIndex : 0) + 1;
                            let pagesText = pageIndex ? pageIndex : 0;

                            let pagesCountText = pagesCount ? pagesCount : 0;

                            return (
                                <>
                                    <div className='flex space-x-2 items-center px-3 py-2 lg:hidden'>
                                        <Button
                                            onClick={() => {
                                                // dispatch(setTablePageIndex(index))
                                                onChangeTablePage && onChangeTablePage(pagesText - 1, pageSize ? pageSize : 50);
                                            }}
                                            variant={`ghost`} size={`icon`} className='h-7 w-7' disabled={pageIndex === 0 ? true : false}>
                                            <ChevronLeft className='w-5 h-5' />
                                        </Button>
                                        <Label className='px-0 text-xs lg:text-sm h-auto'>{`${pageIndexText}`}</Label>
                                        <Label className='px-0 text-xs lg:text-sm text-muted-foreground h-auto'>{`/`}</Label>
                                        <Label className='px-0 text-xs lg:text-sm text-muted-foreground h-auto'>{`${pagesCountText}`}</Label>
                                        <Button
                                            onClick={() => {
                                                // dispatch(setTablePageIndex(index))
                                                onChangeTablePage && onChangeTablePage(pagesText + 1, pageSize ? pageSize : 50);
                                            }}
                                            variant={`ghost`} size={`icon`} className='h-7 w-7' disabled={pageIndex === (pagesCountText - 1) ? true : false}>
                                            <ChevronRight className='w-5 h-5' />
                                        </Button>
                                    </div>

                                    {
                                        [...Array(pagesCount)].map((_, index) => (
                                            <li className={
                                                cn(
                                                    "ka-paging-page-index hidden lg:block",
                                                    pageIndex === (index) && "ka-paging-page-index-active",
                                                )}
                                                key={index}
                                                style={{
                                                    minWidth: 32,
                                                    minHeight: 32,
                                                    // margin: 5
                                                }}
                                            >
                                                <button className='w-full h-full text-xs lg:text-sm'
                                                    onClick={() => {
                                                        // dispatch(setTablePageIndex(index))
                                                        onChangeTablePage && onChangeTablePage(index, pageSize ? pageSize : 50);
                                                    }}
                                                    disabled={loading}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))
                                    }
                                </>
                            )
                        }
                    }
                }}
                loading={{
                    enabled: loading,
                    text: 'Đang tải dữ liệu...',
                }}
                paging={typeof (paging) === "object" ? paging : {
                    ...defaultPaging,
                    position: PagingPosition.Bottom
                }}
            />
        </>
    )
}
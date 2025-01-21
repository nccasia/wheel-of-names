'use client';

import { getSpinHistoryAsync } from '@/app/server/spinWheel';
import { History } from '@/types';
import { Button } from '@heroui/button';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/table';
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import currency from 'currency.js';
import dayjs from 'dayjs';
import { useState } from 'react';
import { IoMdArrowRoundDown } from 'react-icons/io';

const HistorySpin = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  let historyList = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        setIsLoading(false);
      }

      // If no cursor is available, then we're loading the first page.
      // Otherwise, the cursor is the next URL to load, as returned from the previous page.
      const res = await getSpinHistoryAsync(cursor);
      let data = res?.data

      setHasMore(data.hasNext);
      console.log(data);
      return {
        items: data?.items,
        cursor: data?.nextCursor,
      };
    },
  });
  const [loaderRef, scrollerRef] = useInfiniteScroll({ hasMore, onLoadMore: historyList.loadMore });
  return (
    <>
      <Button
        onPress={onOpen}
        color="primary"
        className="border-white border-2 text-xl"
      >
        Lịch sử
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Lịch sử lì xì
              </ModalHeader>
              <ModalBody className='relative'>
                <Table 
                  aria-label='Lịch sử lì xì'
                  removeWrapper
                  isHeaderSticky
                  baseRef={scrollerRef}
                  bottomContent={
                    hasMore ? (
                      <div className="flex w-full justify-center">
                        <Spinner ref={loaderRef} color="white" />
                      </div>
                    ) : null
                  }
                  classNames={{
                    base: "max-h-[520px] overflow-scroll no-scrollbar",
                    table: "min-h-[400px] no-scrollbar",
                  }}>
                  <TableHeader>
                    <TableColumn>Tên người dùng</TableColumn>
                    <TableColumn>Số tiền</TableColumn>
                    <TableColumn>Thời gian</TableColumn>
                  </TableHeader>
                  <TableBody
                    isLoading={isLoading}
                    className='no-scrollbar'
                    items={historyList.items as History[] ?? []}
                    loadingContent={<Spinner color="white" />}
                  >
                    {(item: History) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.userName}</TableCell>
                        <TableCell>{currency(item.rewardValue ?? 0, {
                          symbol: 'VNĐ',
                          precision: 0,
                          pattern: `# !`,
                        }).format()}</TableCell>
                        <TableCell>{dayjs(item.spinTime).format('DD/MM/YYYY HH:mm')}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {
                hasMore &&
                    (
                      <Button
                        onPress={historyList.loadMore}
                        color="secondary"
                        isIconOnly
                        radius='full'
                        variant='flat'
                        className="absolute bottom-0 left-1/2 -translate-x-1/2"
                      >
                      <IoMdArrowRoundDown />
                      </Button>
                    )
                }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default HistorySpin;

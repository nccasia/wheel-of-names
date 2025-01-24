'use client';

import { History } from '@/types';
import { Pagination } from '@heroui/pagination';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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

import currency from 'currency.js';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface Prop {
  isOpen: boolean;
  onOpenChange: () => void;
  // onOpen: () => void;
}
const HistorySpin = ({ isOpen, onOpenChange }: Prop) => {
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState(0);
  const [historyList, setHistoryList] = useState<History[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryList = async () => {
      try {
        const res = await fetch('/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page, limit: 10 }),
        })
        const response = await res.json();
        console.log(response);
        if (response.data) {
          setHistoryList(response.data.items);
          setPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchHistoryList();
    }
  }, [page, isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        className="fixed top-[10%]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Lịch sử lì xì
              </ModalHeader>
              <ModalBody className="relative">
                <Table
                  aria-label="Lịch sử lì xì"
                  classNames={{
                    wrapper: 'min-h-[222px] h-[300px]',
                    table: 'w-full',
                  }}
                  removeWrapper
                  isHeaderSticky
                  bottomContent={
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="secondary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                      />
                    </div>
                  }
                >
                  <TableHeader>
                    <TableColumn className="w-1/3">Tên người dùng</TableColumn>
                    <TableColumn className="w-1/3">Số tiền</TableColumn>
                    <TableColumn className="w-1/3">Thời gian</TableColumn>
                  </TableHeader>
                  <TableBody
                    isLoading={isLoading}
                    emptyContent={'No rows to display.'}
                    items={(historyList as History[]) ?? []}
                    loadingContent={
                      <div className="w-full h-[300px] flex items-center justify-center">
                        <Spinner color="white" />
                      </div>
                    }
                  >
                    {(item: History) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.userName}</TableCell>
                        <TableCell>
                          {currency(item.rewardValue ?? 0, {
                            symbol: ' VNĐ',
                            precision: 0,
                            pattern: `#!`,
                          }).format()}
                        </TableCell>
                        <TableCell>
                          {dayjs(item.spinTime).format('DD/MM/YYYY HH:mm')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default HistorySpin;

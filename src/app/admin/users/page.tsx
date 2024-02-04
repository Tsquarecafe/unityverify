"use client";

import UserRecord from "@/components/UserRecord";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/hooks/use-toast";
import { generateCSVFile } from "@/lib/createCSV";
import { getAllUsers } from "@/lib/redux/slices/user/userThunk";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { cn, debounce } from "@/lib/utils";
import { Download, Search } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

interface pageProps {}
const Users: FC<pageProps> = ({}) => {
  const { allUsers, isLoading, limit, currentPage, numberOfPages } =
    useSelector((store: RootState) => store.user);

  const dispatch = useDispatch<AppDispatch>();

  const [searchInput, setSearchInput] = useState("");

  const retriveUsers = async () => {
    await dispatch(getAllUsers({ search: searchInput }));
  };

  useEffect(() => {
    const getData = debounce(retriveUsers, 2500);
    getData();
  }, [searchInput]);

  useEffect(() => {
    const getUsersDetails = async () => {
      try {
        const res = await dispatch(
          getAllUsers({
            limit,
            page: currentPage,
          })
        );

        if (res.meta.requestStatus === "rejected") {
          return toast({
            title: "Not Authorized",
            description: "You cannot access this Resource",
            variant: "destructive",
          });
        }
      } catch (error) {
        return toast({
          title: "An Error Occurred",
          description: "Error Getting all users ",
          variant: "destructive",
        });
      }
    };

    getUsersDetails();
  }, []);

  const handlePrevPage = async () => {
    dispatch(
      getAllUsers({
        limit,
        page: currentPage > 1 ? currentPage - 1 : numberOfPages,
      })
    );
  };
  const handleSelectPage = async (value: number) => {
    dispatch(
      getAllUsers({
        limit,
        page: value,
      })
    );
  };
  const handleNextPage = async () => {
    dispatch(
      getAllUsers({
        limit,
        page: currentPage < numberOfPages ? currentPage + 1 : 1,
      })
    );
  };

  return (
    <div>
      <>
        <div>
          <div className="flex gap-3 flex-col md:flex-row justify-between  md:items-center text-sm my-6">
            <div className="flex  gap-3 lg:min-w-[500px]">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="search"
                placeholder="Search here"
              />
              <Button className="text-xs">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            {allUsers ? (
              <a
                download="UnityVerify_User_List"
                href={generateCSVFile(allUsers)}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-sm"
                )}
              >
                <Download className="mr-2 h-4 w-4" />
                Export to CSV
              </a>
            ) : null}
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="grid gap-4 grid-cols-[2fr_2fr_1fr_1fr_1.5fr_1.1fr_2rem] grid-rows-1 w-full mb-3 bg-gray-100 p-3 rounded-lg">
                  <th className="text-left text-sm">Name</th>
                  <th className="text-left text-sm">Email</th>
                  <th className="text-left text-sm">Acc Balance</th>
                  <th className="text-left text-sm">Agent Bonus</th>
                  <th className="text-left text-sm">No. of Transaction</th>
                  <th className="text-left text-sm">No. of Payment</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {allUsers && allUsers?.length > 0 && !isLoading ? (
                      <div className="space-y-2 w-full">
                        {allUsers.slice(0, 7).map((user) => (
                          <div key={user.id}>
                            <UserRecord
                              {...user}
                              // @ts-ignore
                              numberOfTransactions={user.transactions?.length}
                              // @ts-ignore
                              numberPayment={user.payments?.length}
                            />
                          </div>
                        ))}
                      </div>
                    ) : !isLoading && allUsers?.length === 0 ? (
                      <div className="bg-white p-6 flex justify-center items-center">
                        <h2>Nothing to Display</h2>
                      </div>
                    ) : (
                      <div className="flex w-full h-full items-center justify-center">
                        <TailSpin />
                      </div>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    {numberOfPages ? (
                      <div className="flex gap-6 items-center justify-center mx-auto mt-8 w-full ">
                        <Button
                          disabled={numberOfPages <= 1}
                          className="bg-slate-700"
                          onClick={handlePrevPage}
                        >
                          Prev
                        </Button>
                        <div className="flex gap-4">
                          {[...Array(numberOfPages).keys()].map((_, index) => (
                            <button
                              className={`w-10 h-10 rounded-lg  ${
                                currentPage === index + 1
                                  ? "bg-emerald-800 text-white "
                                  : "bg-gray-300"
                              } hover:bg-emerald-500 hover:text-white`}
                              onClick={() => handleSelectPage(index + 1)}
                              key={index}
                            >
                              {index + 1}
                            </button>
                          ))}
                        </div>
                        <Button
                          disabled={numberOfPages <= 1}
                          className="bg-slate-800"
                          onClick={handleNextPage}
                        >
                          Next
                        </Button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    </div>
  );
};

export default Users;

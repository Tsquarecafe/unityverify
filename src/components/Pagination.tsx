import { FC } from "react";
import { Button } from "./ui/Button";

interface PaginationProps {
  numberOfPages: number;
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handleSelectPage: (number: number) => void;
}
const Pagination: FC<PaginationProps> = ({
  currentPage,
  numberOfPages,
  handlePrevPage,
  handleSelectPage,
  handleNextPage,
}) => {
  return (
    <tr>
      <td>
        {numberOfPages && numberOfPages > 1 ? (
          <div className="flex  gap-6 items-center justify-center mx-auto mt-8 w-full ">
            <Button className="bg-slate-700" onClick={handlePrevPage}>
              Prev
            </Button>
            <div className="flex gap-4 flex-wrap">
              {[...Array(numberOfPages).keys()].slice(0, 10).map((_, index) => (
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

              {numberOfPages > 10
                ? [...Array(numberOfPages).keys()].slice(-1).map((_, index) => (
                    <>
                      <span>...</span>
                      <button
                        className={`w-10 h-10 rounded-lg  ${
                          currentPage ===
                          [...Array(numberOfPages).keys()].length
                            ? "bg-emerald-800 text-white "
                            : "bg-gray-300"
                        } hover:bg-emerald-500 hover:text-white`}
                        onClick={() =>
                          handleSelectPage(
                            [...Array(numberOfPages).keys()].length
                          )
                        }
                        key={index}
                      >
                        {[...Array(numberOfPages).keys()].length}
                      </button>
                    </>
                  ))
                : null}
            </div>
            <Button className="bg-slate-800" onClick={handleNextPage}>
              Next
            </Button>
          </div>
        ) : null}
      </td>
    </tr>
  );
};

export default Pagination;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const availabilityOptions = ["Боломжтой", "Хүлээгдэж байна", "Захиалагдсан"];

interface PerformerFiltersProps {
  genres: string[];
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedAvailability: string[];
  setSelectedAvailability: (availability: string[]) => void;
  minPopularity: number;
  setMinPopularity: (value: number) => void;
  minPrice: number;
  setMinPrice: (value: number) => void;
  maxPrice: number;
  setMaxPrice: (value: number) => void;
  isGenreOpen: boolean;
  setIsGenreOpen: (value: boolean) => void;
  clearFilters: () => void;
}

export default function PerformerFilters({
  genres,
  selectedGenres,
  setSelectedGenres,
  selectedAvailability,
  setSelectedAvailability,
  minPopularity,
  setMinPopularity,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  isGenreOpen,
  setIsGenreOpen,
  clearFilters,
}: PerformerFiltersProps) {
  return (
    <div>
      <h2 className="font-bold text-white mb-4 mt-3">Шүүлтүүр</h2>

      {/* Genre */}
      <div className="mb-6">
        <h3
          className="font-semibold mb-3 flex items-center gap-2 cursor-pointer hover:text-neutral-300"
          onClick={() => setIsGenreOpen(!isGenreOpen)}
        >
          🎵 Төрөл
          {isGenreOpen ? (
            <FaChevronUp className="ml-auto" />
          ) : (
            <FaChevronDown className="ml-auto" />
          )}
        </h3>

        {isGenreOpen && (
          <div className="space-y-2">
            {genres.map((genre) => (
              <label
                key={genre}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Checkbox
                  checked={selectedGenres.includes(genre)}
                  onCheckedChange={(checked: any) =>
                    checked
                      ? setSelectedGenres([...selectedGenres, genre])
                      : setSelectedGenres(
                          selectedGenres.filter((g) => g !== genre)
                        )
                  }
                />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Боломжтой эсэх</h3>
        <div className="space-y-2">
          {availabilityOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedAvailability.includes(option)}
                onCheckedChange={(checked: any) =>
                  checked
                    ? setSelectedAvailability([...selectedAvailability, option])
                    : setSelectedAvailability(
                        selectedAvailability.filter((a) => a !== option)
                      )
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Popularity */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Алдартай байдал</h3>
        <div className="px-2 py-4">
          <Slider
            min={0}
            max={100000}
            step={5000}
            value={[minPopularity]}
            onValueChange={(value) => setMinPopularity(value[0])}
            className="w-full"
          />
        </div>
        <div className="text-sm text-gray-400 mt-3 flex justify-between px-2 items-center">
          <span>Хамгийн бага: {minPopularity.toLocaleString()}</span>
          <span className="text-xs text-gray-500">Макс: 100,000</span>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">💰 Үнийн хүрээ</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">
              Хамгийн бага:
            </label>
            <Select
              value={minPrice.toString()}
              onValueChange={(value) => setMinPrice(parseInt(value))}
            >
              <SelectTrigger className="w-full bg-neutral-800 text-white border-neutral-700 hover:border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                <SelectItem value="0">0₮</SelectItem>
                <SelectItem value="500000">500,000₮</SelectItem>
                <SelectItem value="1000000">1,000,000₮</SelectItem>
                <SelectItem value="1500000">1,500,000₮</SelectItem>
                <SelectItem value="2000000">2,000,000₮</SelectItem>
                <SelectItem value="3000000">3,000,000₮</SelectItem>
                <SelectItem value="5000000">5,000,000₮</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-2 block font-medium">
              Хамгийн их:
            </label>
            <Select
              value={maxPrice.toString()}
              onValueChange={(value) => setMaxPrice(parseInt(value))}
            >
              <SelectTrigger className="w-full bg-neutral-800 text-white border-neutral-700 hover:border-neutral-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                <SelectValue placeholder="Сонгох" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 text-white border-neutral-700">
                <SelectItem value="1000000">1,000,000₮</SelectItem>
                <SelectItem value="2000000">2,000,000₮</SelectItem>
                <SelectItem value="3000000">3,000,000₮</SelectItem>
                <SelectItem value="5000000">5,000,000₮</SelectItem>
                <SelectItem value="10000000">10,000,000₮</SelectItem>
                <SelectItem value="20000000">20,000,000₮</SelectItem>
                <SelectItem value="100000000">100,000,000₮</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <button
        onClick={clearFilters}
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        Шүүлтүүр цэвэрлэх
      </button>
    </div>
  );
}

import { TimeConstants } from "@/constants/timeConstants";

const checkNewYear = () => {
    const currentDate = new Date();
    const lunarNewYear = new Date(TimeConstants.NEW_LUNAR_YEAR);
    return currentDate >= lunarNewYear;
};

export { checkNewYear };

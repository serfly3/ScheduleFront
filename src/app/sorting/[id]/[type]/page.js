import Style from "./page.module.css";
import ScheduleTeacher from "@/app/Components/ScheduleTeacher/ScheduleTeacher";
import ScheduleClass from "@/app/Components/ScheduleClass/ScheduleClass";
import { NotFound } from "@/app/Components/NotFound/NotFound";

export default async function Home(props) {
  const params = await props.params;  // получаем параметры из URL
  console.log(params.type, typeof(params.type));

  return (
    <div className={Style["container"]}>
      {params.id === "class" ? (
        <ScheduleClass className={params.type} />
      ) : params.id === "teacher" ? (
        <ScheduleTeacher teacherName={params.type} />
      ) : (
        <NotFound typePage={"страница"}/> // если параметр не "class" или "teacher"
      )}
    </div>
  );
}

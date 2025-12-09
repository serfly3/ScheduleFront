'use client'
import { ClassList } from "@/app/Components/ClassList/ClassList";
import { List } from "@/app/Components/List/List";
import Style from "./PageSort.module.css";
import { TeachersList } from "@/app/Components/TeachersList/TeachersList";
// import { RoomList } from "@/app/Components/RoomList/RoomList";
import { VertBorder } from "@/app/Components/VertBorder/VertBorder";
import ThemeContext from "@/context/ThemeContext";
import { useContext, useState } from "react";
import { NotFound } from "../NotFound/NotFound";

export const PageSort = ({ params }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const [isListOpen, setIsListOpen] = useState(false);

    const handleListToggle = (isOpen) => {
        setIsListOpen(isOpen);
    };

    // Проверяем, является ли id допустимым
    const isValidId = params.id === "class" || params.id === "teacher";

    return (
        <div className={`${Style["container"]} ${isDarkMode ? Style["dark"] : ""}`}>
            {/* Показываем List только если id корректный */}
            {isValidId && <List onToggle={handleListToggle} />}
            
            <div className={`${Style["content-below"]} ${isListOpen ? Style["shifted"] : ""}`}>
                {/* Показываем VertBorder только если id корректный */}
                {isValidId && <VertBorder isListOpen={isListOpen} />}
                
                {/* В зависимости от id рендерим нужный список или компонент NotFound */}
                {params.id === "class" && <ClassList isListOpen={isListOpen} />}
                {params.id === "teacher" && <TeachersList isListOpen={isListOpen} />}
                {!isValidId && <NotFound typePage="страница" />}  {/* Показать NotFound, если id некорректен */}
            </div>
        </div>
    );
};

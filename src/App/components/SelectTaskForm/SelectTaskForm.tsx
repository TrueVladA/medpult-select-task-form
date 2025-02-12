import React, { useEffect, useRef, useState } from 'react'
import {
	selectTaskContext,
	SelectTaskData,
	SelectTaskFilters,
} from '../../stores/SelectTaskContext'
import Header from '../Header/Header'
import SelectTaskFiltersForm from '../SelectTaskFiltersForm/SelectTaskFiltersForm'
import SelectTaskList from '../SelectTaskList/SelectTaskList'
import { getDataFromDraft } from '../../shared/utils/utils'
import Loader from '../../../UIKit/Loader/Loader'
import Scripts from '../../shared/utils/clientScripts'
import {
	DateFilter,
	StringFilter,
	ListFilter,
	AppFilter,
} from '../../../UIKit/Filters/FiltersTypes'

/** Форма отбора задач */
export default function SelectTaskForm() {
	const [data, setValue] = selectTaskContext.useState()
	const contentWrapperRef = useRef<HTMLDivElement>(null)

	// Инициализация с черновиком
	const initializeWithDraft = (filtersData: SelectTaskData) => {
		try {
			const draftData: SelectTaskData | undefined = getDataFromDraft()
			if (draftData) {
				for(const key of Object.keys(draftData.filters)) {
				  const resetBuffer = filtersData.filters[key].reset;
				  filtersData.filters[key] = draftData.filters[key];
				  filtersData.filters[key].reset = resetBuffer;
				}

				filtersData.filterStates = draftData.filterStates
			}
		} catch (e) {
			throw new Error('Ошибка получения данных из черновика: ' + e)
		}
	}

	const [isInitializing, setIsInitializing] = useState<boolean>(true)

	// Подгрузка данных
	useEffect(() => {
		Scripts.OnInit().then(() => {
			// Данные формы из черновика
			let filtersData: SelectTaskData = new SelectTaskData()

			initializeWithDraft(filtersData)

			// Установка фильтров
			setValue('filters', filtersData.filters)
			// Установка состояния оберток фильтров
			setValue('filterStates', filtersData.filterStates)

			setIsInitializing(false)
		})
	}, [])

	useEffect(() => {
		console.log(data)
	}, [data])

	const [isShowFilters, setIsShowFilters] = useState<boolean>(true)
	const toggleShowFilters = () => setIsShowFilters(!isShowFilters)

	// Ширина списка
	const [listWidth, setListWidth] = useState<number>(0)

	// Назначение обработчиков событий
	useEffect(() => {
		handleResizeWrapper()
		window.addEventListener('resize', handleResizeWrapper)

		return () => {
			window.removeEventListener('resize', handleResizeWrapper)
		}
	}, [])

	// Обработчик изменения размера
	const handleResizeWrapper = () => {
		const element = document.querySelector(".select-task-form__content");
		const width = element?.getBoundingClientRect().width ?? 0;
		setListWidth(width);
	}

	const setContentWrapperRef = (element: HTMLDivElement) => {
	  handleResizeWrapper()
	};

	return (
		<selectTaskContext.Provider value={{ data, setValue }}>
			<div className="select-task-form">
				{isInitializing && (
					<div className="select-task-form__loader">
						<Loader />
					</div>
				)}
				{!isInitializing && (
					<>
						<div className="select-task-form__header">
							<Header
								clickFilterHandler={toggleShowFilters}
								elementsCount={data.elementsCount}
								title="Форма отбора задач"
							/>
						</div>
						<div className="select-task-form__content" ref={setContentWrapperRef}>
							<div
								className={`select-task-form__filters${
									!isShowFilters ? ' select-task-form__filters_hidden' : ''
								}`}
							>
								<SelectTaskFiltersForm />
							</div>
							<div className="select-task-form__list">
								<div>
									<SelectTaskList width={listWidth} />
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</selectTaskContext.Provider>
	)
}

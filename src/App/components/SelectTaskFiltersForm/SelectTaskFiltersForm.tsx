import React, { useEffect, useState } from 'react'
import FiltersWrapper from '../../../UIKit/Filters/FiltersWrapper/FiltersWrapper'
import FilterItemWrapper from '../../../UIKit/Filters/FilterItems/FilterItemWrapper/FilterItemWrapper'
import FilterItemString from '../../../UIKit/Filters/FilterItems/FilterItemString/FilterItemString'
import { selectTaskContext } from '../../stores/SelectTaskContext'
import { ObjectItem, IFilter, StringFilter } from '../../../UIKit/Filters/FiltersTypes'
import FilterItemCategory from '../../../UIKit/Filters/FilterItems/FilterItemCategory/FilterItemCategory'
import FilterItemDates from '../../../UIKit/Filters/FilterItems/FilterItemDates/FilterItemDates'
import FilterItemSearch from '../../../UIKit/Filters/FilterItems/FilterItemSearch/FilterItemSearch'
import { FetchInputData } from '../../../UIKit/shared/types/types'
import Scripts from '../../shared/utils/clientScripts'
import FilterItemApp from '../../../UIKit/Filters/FilterItems/FilterItemApp/FilterItemApp'
import { saveState } from '../../shared/utils/utils'

interface SelectTaskFiltersProps {}

/** Фильтры формы отбра задач */
export default function SelectTaskFiltersForm({}: SelectTaskFiltersProps) {
	const { data, setValue } = selectTaskContext.useContext()
	const filters = data.filters

	/** Изменение значения конкретного фильтра */
	const changeFilterValue = (key: string, value: IFilter) => {
		const currentFilters = filters
		currentFilters[key] = value
		setValue('filters', currentFilters)
	}

	const changeValueConstructor = (key: string) => {
		return (value: IFilter) => changeFilterValue(key, value)
	}

	/** Статусы */
	const [statuses, setStatuses] = useState<ObjectItem[]>([])
	/** Типы */
	const [types, setTypes] = useState<ObjectItem[]>([])
	/** Виды */
	const [sorts, setSorts] = useState<ObjectItem[]>([])

	/** Получение вариантов категорий */
	React.useLayoutEffect(() => {
		Scripts.getStatuses().then((items) => setStatuses(items))
		Scripts.getTypes().then((items) => setTypes(items))
		Scripts.getSorts().then((items) => setSorts(items))
	}, [])

	/** Сброс фильтров */
	const resetFilters = () => {
		data.filters.reset()
		setValue('filters', data.filters)
	}

	/** Обработчик нажатия на кнопку поиска */
	const searchHandler = async () => {
		// Количество отобранных элементов
		const elementsCount = await Scripts.getTasksCount(data.filters)
		setValue('elementsCount', elementsCount)

		// Поиск
		data.onClickSearch()
	}

	const searchSorts = async (page: number, query?: string): Promise<FetchInputData> => {
		const sortsValues = sorts

		if (!query)
			return {
				items: sorts,
				hasMore: false,
			}

		const filterSorts = sortsValues.filter(
			(sort) => sort.value.toLowerCase().indexOf(query.toLowerCase()) != -1
		)
		return {
			items: filterSorts,
			hasMore: false,
		}
	}

	// Установка состояния обертки
	const setIsOpenFactory = (code: string) => {
		return (isOpen: boolean) => {
			const filterStates = data.filterStates

			filterStates[code] = isOpen

			setValue('filterStates', filterStates)
		}
	}

	/** Сохранение состояния формы */
	const saveStateHandler = () => {
		saveState(data)
	}

	/** Ссылка на форму отбора обращения */
	const selectRequestHref = Scripts.getSelectRequestLink()
	/** Ссылка на форму отбора застрахованного */
	const selectInsuredHref = Scripts.getSelectInsuredLink()

	// TODO: Побороть spaghetti 🍝🍝🍝
	return (
		<FiltersWrapper
			searchHandler={searchHandler}
			resetHandler={resetFilters}
			isSearchButtonDisabled={Scripts.getSelectTaskAccessSettings().searchButton < 2}
		>
			<FilterItemString
				setIsOpenInit={setIsOpenFactory(data.filters.number.fieldCode)}
				isOpenInit={data.filterStates.number}
				title={data.filters.number.fieldName}
				filterValue={data.filters.number}
				setFilterValue={changeValueConstructor(data.filters.number.fieldCode)}
			/>
			<FilterItemCategory
				setIsOpenInit={setIsOpenFactory(data.filters.status.fieldCode)}
				isOpenInit={data.filterStates.status}
				title={data.filters.status.fieldName}
				variants={statuses}
				filterValue={data.filters.status}
				setFilterValue={changeValueConstructor(data.filters.status.fieldCode)}
			/>
			<FilterItemCategory
				setIsOpenInit={setIsOpenFactory(data.filters.type.fieldCode)}
				isOpenInit={data.filterStates.type}
				title={data.filters.type.fieldName}
				variants={types}
				filterValue={data.filters.type}
				setFilterValue={changeValueConstructor(data.filters.type.fieldCode)}
			/>
			<FilterItemSearch
				setIsOpenInit={setIsOpenFactory(data.filters.sort.fieldCode)}
				isOpenInit={data.filterStates.sort}
				title={data.filters.sort.fieldName}
				filterValue={data.filters.sort}
				getDataHandler={searchSorts}
				setFilterValue={changeValueConstructor(data.filters.sort.fieldCode)}
			/>
			<FilterItemDates
				setIsOpenInit={setIsOpenFactory(data.filters.createdAt.fieldCode)}
				isOpenInit={data.filterStates.createdAt}
				title={data.filters.createdAt.fieldName}
				filterValue={data.filters.createdAt}
				setFilterValue={changeValueConstructor(data.filters.createdAt.fieldCode)}
			/>
			<FilterItemDates
				setIsOpenInit={setIsOpenFactory(data.filters.controledAt.fieldCode)}
				isOpenInit={data.filterStates.controledAt}
				title={data.filters.controledAt.fieldName}
				filterValue={data.filters.controledAt}
				setFilterValue={changeValueConstructor(data.filters.controledAt.fieldCode)}
			/>
			<FilterItemSearch
				setIsOpenInit={setIsOpenFactory(data.filters.author.fieldCode)}
				isOpenInit={data.filterStates.author}
				title={data.filters.author.fieldName}
				filterValue={data.filters.author}
				getDataHandler={Scripts.getUsers}
				setFilterValue={changeValueConstructor(data.filters.author.fieldCode)}
			/>
			<FilterItemSearch
				setIsOpenInit={setIsOpenFactory(data.filters.authorGroup.fieldCode)}
				isOpenInit={data.filterStates.authorGroup}
				title={data.filters.authorGroup.fieldName}
				filterValue={data.filters.authorGroup}
				getDataHandler={Scripts.getUserGroups}
				setFilterValue={changeValueConstructor(data.filters.authorGroup.fieldCode)}
			/>
			<FilterItemSearch
				setIsOpenInit={setIsOpenFactory(data.filters.executor.fieldCode)}
				isOpenInit={data.filterStates.executor}
				title={data.filters.executor.fieldName}
				filterValue={data.filters.executor}
				getDataHandler={Scripts.getUsers}
				setFilterValue={changeValueConstructor(data.filters.executor.fieldCode)}
			/>
			<FilterItemSearch
				setIsOpenInit={setIsOpenFactory(data.filters.executorGroup.fieldCode)}
				isOpenInit={data.filterStates.executorGroup}
				title={data.filters.executorGroup.fieldName}
				filterValue={data.filters.executorGroup}
				getDataHandler={Scripts.getUserGroups}
				setFilterValue={changeValueConstructor(data.filters.executorGroup.fieldCode)}
			/>
			<FilterItemApp
				href={selectRequestHref}
				saveStateHandler={saveStateHandler}
				setIsOpenInit={setIsOpenFactory(data.filters.request.fieldCode)}
				isOpenInit={data.filterStates.request}
				title={data.filters.request.fieldName}
				filterValue={data.filters.request}
				setFilterValue={changeValueConstructor(data.filters.request.fieldCode)}
			/>
			<FilterItemString
				setIsOpenInit={setIsOpenFactory(data.filters.insured.fieldCode)}
				isOpenInit={data.filterStates.insured}
				title={data.filters.insured.fieldName}
				filterValue={data.filters.insured}
				setFilterValue={changeValueConstructor(data.filters.insured.fieldCode)}
			/>
			<FilterItemString
				setIsOpenInit={setIsOpenFactory(data.filters.insurer.fieldCode)}
				isOpenInit={data.filterStates.insurer}
				title={data.filters.insurer.fieldName}
				filterValue={data.filters.insurer}
				setFilterValue={changeValueConstructor(data.filters.insurer.fieldCode)}
			/>
			{/* <FilterItemString setIsOpenInit={setIsOpenFactory(data.filters.request.fieldCode)} isOpenInit={data.filterStates.request} title={data.filters.request.fieldName} filterValue={data.filters.request} setFilterValue={changeValueConstructor(data.filters.request.fieldCode)} /> */}
			{/* <FilterItemString isOpenInit={data.filterStates.insured} title={data.filters.insured.fieldName} filterValue={data.filters.insured} setFilterValue={changeValueConstructor(data.filters.insured.fieldCode)} /> */}
		</FiltersWrapper>
	)
}

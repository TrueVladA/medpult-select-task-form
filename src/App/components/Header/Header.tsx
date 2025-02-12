import React, { PropsWithChildren, useState } from 'react'
import icons from '../../shared/icons'
import FilterButton from '../../../UIKit/Filters/FilterButton/FilterButton'
import { selectTaskContext } from '../../stores/SelectTaskContext'

interface HeaderProps {
	/** Заголовок */
	title: string
	/** Количество элементов */
	elementsCount?: number
	/** Обработчик нажатия на кнопку Фильтры */
	clickFilterHandler?: () => void
}

/** Шапка страницы */
function Header({
	title,
	elementsCount = 0,
	clickFilterHandler,
	children,
}: PropsWithChildren<HeaderProps>) {
	const { data, setValue } = selectTaskContext.useContext()

	/** Проверка имеются ли активные фильтры */
	const checkHasActiveFilters = (): boolean => {
		// Поиск по категориям
		if (data.filters.author.values.length) return true
		if (data.filters.executor.values.length) return true
		if (data.filters.status.values.length) return true
		if (data.filters.type.values.length) return true
		if (data.filters.sort.values.length) return true

		// Строковый поиск
		if (data.filters.number.value) return true
		if (data.filters.insured.value) return true
		if (data.filters.insurer.value) return true

		// Поиск по датам
		if (data.filters.createdAt.valueFrom || data.filters.createdAt.valueTo) return true
		if (data.filters.controledAt.valueFrom || data.filters.controledAt.valueTo) return true

		// Поиск по Элементам приложения
		if (data.filters.request.value.code) return true

		return false
	}

	const [isShowIndicator, setIsShowIndicator] = useState<boolean>(checkHasActiveFilters())

	/** Обработчик нажатия на кнопку */
	const clickHandler = () => {
		if (clickFilterHandler) clickFilterHandler()
	}

	/** Нажатие на кнопку назад */
	const onClickReturn = () => {
		history.back()
	}

	React.useLayoutEffect(() => setIsShowIndicator(checkHasActiveFilters()), [data])

	return (
		<div className="header">
			<div className="header__returnButton" onClick={onClickReturn}>
				{icons.ReturnButton}
			</div>
			<div className="header__filterButton">
				<FilterButton isShowIndicator={isShowIndicator} clickHandler={clickHandler} />
			</div>
			<div className="header__title">{title}</div>
			<div className="header__count">
				Отобрано: <span>{elementsCount}</span>
			</div>
			<div className="header__buttons">{children}</div>
		</div>
	)
}

export default Header

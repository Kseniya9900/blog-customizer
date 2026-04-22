import { FormEvent, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import {
	ArticleStateType,
	backgroundColors,
	contentWidthArr,
	defaultArticleState,
	fontColors,
	fontFamilyOptions,
	fontSizeOptions,
} from 'src/constants/articleProps';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	onApply: (state: ArticleStateType) => void;
	currentState: ArticleStateType;
};

export const ArticleParamsForm = ({
	onApply,
	currentState,
}: ArticleParamsFormProps) => {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(currentState);

	const formContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isFormOpen) {
			return;
		}

		const handleOverlayClick = (event: MouseEvent) => {
			if (
				formContainerRef.current &&
				!formContainerRef.current.contains(event.target as Node)
			) {
				setIsFormOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOverlayClick);

		return () => {
			document.removeEventListener('mousedown', handleOverlayClick);
		};
	}, [isFormOpen]);

	useEffect(() => {
		if (isFormOpen) {
			setFormState(currentState);
		}
	}, [isFormOpen, currentState]);

	const handleArrowButtonClick = () => {
		setIsFormOpen((previousState) => !previousState);
	};

	const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onApply(formState);
	};

	const handleFormReset = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	const updateFormField =
		<Key extends keyof ArticleStateType>(fieldName: Key) =>
		(fieldValue: ArticleStateType[Key]) => {
			setFormState((previousState) => ({
				...previousState,
				[fieldName]: fieldValue,
			}));
		};

	return (
		<div ref={formContainerRef}>
			<ArrowButton isOpen={isFormOpen} onClick={handleArrowButtonClick} />

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleFormSubmit}
					onReset={handleFormReset}>
					<h2 className={styles.title}>ЗАДАЙТЕ ПАРАМЕТРЫ</h2>

					<div className={styles.field}>
						<Select
							title='Шрифт'
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={updateFormField('fontFamilyOption')}
						/>
					</div>

					<div className={styles.field}>
						<RadioGroup
							title='Размер шрифта'
							name='fontSize'
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={updateFormField('fontSizeOption')}
						/>
					</div>

					<div className={styles.field}>
						<Select
							title='Цвет шрифта'
							selected={formState.fontColor}
							options={fontColors}
							onChange={updateFormField('fontColor')}
						/>
					</div>

					<Separator />

					<div className={styles.field}>
						<Select
							title='Цвет фона'
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={updateFormField('backgroundColor')}
						/>
					</div>

					<div className={styles.field}>
						<Select
							title='Ширина контента'
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={updateFormField('contentWidth')}
						/>
					</div>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};

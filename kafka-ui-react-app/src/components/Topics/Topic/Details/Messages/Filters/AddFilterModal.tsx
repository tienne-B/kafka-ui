import * as React from 'react';
import * as S from 'components/Topics/Topic/Details/Messages/Filters/Filters.styled';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import Input from 'components/common/Input/Input';
import { Textarea } from 'components/common/Textbox/Textarea.styled';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from 'components/common/Button/Button';
import yup from 'lib/yupExtended';
import { yupResolver } from '@hookform/resolvers/yup';

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  code: yup.string().required(),
});

interface AddFilterModalProps {
  toggleIsOpen(): void;
}
interface FormValues {
  name: string;
  code: string;
}

const AddFilterModal: React.FC<AddFilterModalProps> = ({ toggleIsOpen }) => {
  const [addFilter, setAddFilter] = React.useState(false);
  const [toggleSaveFilter, setToggleSaveFilter] = React.useState(false);

  const [savedFilters, setSavedFilters] = React.useState([
    { id: 1, name: 'Saved filter 1', code: 'code' },
    { id: 2, name: 'Saved filter 2', code: 'code' },
    { id: 3, name: 'Saved filter 3', code: 'code' },
    { id: 4, name: 'Saved filter 4', code: 'code' },
    { id: 5, name: 'Saved filter 5', code: 'code' },
  ]);

  const addNewFilterHandler = () => {
    setAddFilter(!addFilter);
  };
  const deleteFilter = (index: number) => {
    const filters = [...savedFilters];
    filters.splice(index, 1);
    setSavedFilters(filters);
  };
  const methods = useForm<FormValues>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, isValid, errors },
  } = methods;
  const onSubmit = React.useCallback(
    async (values: FormValues) => {
      const newId = savedFilters[savedFilters.length - 1].id + 1;
      const filters = [...savedFilters];
      filters.push({ id: newId, name: values.name, code: values.code });
      setSavedFilters(filters);
      setAddFilter(!addFilter);
    },
    [addFilter, savedFilters]
  );
  return (
    <S.MessageFilterModal>
      <S.FilterTitle>Add filter</S.FilterTitle>
      {!addFilter ? (
        <>
          <S.NewFilterIcon onClick={addNewFilterHandler}>
            <i className="fas fa-plus fa-sm" /> New filter
          </S.NewFilterIcon>
          <S.CreatedFilter>Created filters</S.CreatedFilter>
          <S.SavedFiltersContainer>
            {savedFilters.map((savedFilter, index) => (
              <S.SavedFilter key={savedFilter.id}>
                <S.SavedFilterName>{savedFilter.name}</S.SavedFilterName>
                <S.DeleteSavedFilter onClick={() => deleteFilter(index)}>
                  <i className="fas fa-times" />
                </S.DeleteSavedFilter>
              </S.SavedFilter>
            ))}
          </S.SavedFiltersContainer>
          <S.FilterButtonWrapper>
            <Button
              buttonSize="M"
              buttonType="secondary"
              onClick={toggleIsOpen}
            >
              Cancel
            </Button>
            <Button buttonSize="M" buttonType="primary" type="submit">
              Add filter
            </Button>
          </S.FilterButtonWrapper>
        </>
      ) : (
        <FormProvider {...methods}>
          <S.CreatedFilter>Create a new filter</S.CreatedFilter>
          <form onSubmit={handleSubmit(onSubmit)} aria-label="Add new Filter">
            <div>
              <InputLabel>Display name</InputLabel>
              <Input
                inputSize="M"
                placeholder="Enter Name"
                autoComplete="off"
                name="name"
              />
            </div>
            <div>
              <ErrorMessage errors={errors} name="name" />
            </div>
            <div>
              <InputLabel>Filter code</InputLabel>
              <Controller
                control={control}
                name="code"
                render={({ field: { onChange, ref } }) => (
                  <Textarea ref={ref} onChange={onChange} />
                )}
              />
            </div>
            <div>
              <ErrorMessage errors={errors} name="code" />
            </div>
            <S.CheckboxWrapper>
              <input
                type="checkbox"
                checked={toggleSaveFilter}
                onChange={() => {
                  setToggleSaveFilter(!toggleSaveFilter);
                }}
              />
              <InputLabel>Save this filter</InputLabel>
            </S.CheckboxWrapper>
            <S.FilterButtonWrapper>
              <Button
                buttonSize="M"
                buttonType="secondary"
                onClick={() => setAddFilter(!addFilter)}
              >
                Cancel
              </Button>
              <Button
                buttonSize="M"
                buttonType="primary"
                type="submit"
                disabled={!isValid || isSubmitting || !isDirty}
              >
                Add filter
              </Button>
            </S.FilterButtonWrapper>
          </form>
        </FormProvider>
      )}
    </S.MessageFilterModal>
  );
};

export default AddFilterModal;

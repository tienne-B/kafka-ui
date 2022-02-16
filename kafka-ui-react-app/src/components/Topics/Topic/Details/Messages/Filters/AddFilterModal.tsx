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
import { MessageFilters } from 'components/Topics/Topic/Details/Messages/Filters/Filters';
import { useParams } from 'react-router-dom';

const validationSchema = yup.object().shape({
  name: yup.string().required(),
  code: yup.string().required(),
});

interface AddFilterModalProps {
  toggleIsOpen(): void;
  filters: MessageFilters[];
  addFilter(values: MessageFilters): void;
  deleteFilter(index: number): void;
  activeFilterHandler(activeFilter: MessageFilters): void;
}

const AddFilterModal: React.FC<AddFilterModalProps> = ({
  toggleIsOpen,
  filters,
  addFilter,
  deleteFilter,
  activeFilterHandler,
}) => {
  const [addNewFilter, setAddNewFilter] = React.useState(false);
  const [toggleSaveFilter, setToggleSaveFilter] = React.useState(false);

  const [selectedFilter, setSelectedFilter] = React.useState(-1);
  const activeFilter = () => {
    if (selectedFilter > -1) {
      activeFilterHandler(filters[selectedFilter]);
      toggleIsOpen();
    }
  };
  const methods = useForm<MessageFilters>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });
  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, isValid, errors },
  } = methods;
  const onSubmit = React.useCallback(
    async (values: MessageFilters) => {
      if (!toggleSaveFilter) {
        activeFilterHandler(values);
      } else {
        addFilter(values);
      }
      setAddNewFilter(!addNewFilter);
    },
    [addFilter, filters, addNewFilter, toggleSaveFilter]
  );
  const { clusterName } = useParams<{ clusterName: string }>();
  return (
    <S.MessageFilterModal>
      <S.FilterTitle>Add filter</S.FilterTitle>
      {!addNewFilter ? (
        <>
          <S.NewFilterIcon onClick={() => setAddNewFilter(!addNewFilter)}>
            <i className="fas fa-plus fa-sm" /> New filter
          </S.NewFilterIcon>
          <S.CreatedFilter>Created filters</S.CreatedFilter>
          <S.SavedFiltersContainer>
            {filters.length === 0 ? (
              <p>no saved filter(s)</p>
            ) : (
              filters.map((filter, index) => (
                <S.SavedFilter
                  key={Math.random()}
                  selected={selectedFilter === index}
                  onClick={() => setSelectedFilter(index)}
                >
                  <S.SavedFilterName>{filter.name}</S.SavedFilterName>
                  <S.DeleteSavedFilter onClick={() => deleteFilter(index)}>
                    <i className="fas fa-times" />
                  </S.DeleteSavedFilter>
                </S.SavedFilter>
              ))
            )}
          </S.SavedFiltersContainer>
          <S.FilterButtonWrapper>
            <Button
              buttonSize="M"
              buttonType="secondary"
              onClick={toggleIsOpen}
            >
              Cancel
            </Button>
            <Button buttonSize="M" buttonType="primary" onClick={activeFilter}>
              Select filter
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
                onClick={() => setAddNewFilter(!addNewFilter)}
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

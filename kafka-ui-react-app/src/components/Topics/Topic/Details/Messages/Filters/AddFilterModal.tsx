import * as React from 'react';
import * as S from 'components/Topics/Topic/Details/Messages/Filters/Filters.styled';
import { InputLabel } from 'components/common/Input/InputLabel.styled';
import Input from 'components/common/Input/Input';
import { Textarea } from 'components/common/Textbox/Textarea.styled';

interface AddFilterModalProps {
  toggleIsOpen(): void;
}

const AddFilterModal: React.FC<AddFilterModalProps> = ({ toggleIsOpen }) => {
  const [addFilter, setAddFilter] = React.useState(false);
  const [toggleSaveFilter, setToggleSaveFilter] = React.useState(false);
  const savedFilters = [
    { name: 'Saved filter 1', code: 'code' },
    { name: 'Saved filter 2', code: 'code' },
    { name: 'Saved filter 3', code: 'code' },
    { name: 'Saved filter 4', code: 'code' },
    { name: 'Saved filter 5', code: 'code' },
  ];
  const AddNewFilterHandler = () => {
    setAddFilter(!addFilter);
  };
  return (
    <S.MessageFilterModal>
      <S.FilterTitle>Add filter</S.FilterTitle>
      {!addFilter ? (
        <>
          <S.NewFilterIcon onClick={AddNewFilterHandler}>
            <i className="fas fa-plus fa-sm" /> New filter
          </S.NewFilterIcon>
          <S.CreatedFilter>Created filters</S.CreatedFilter>
          <S.SavedFiltersContainer>
            {savedFilters.map((savedFilter) => (
              <S.SavedFilter>
                <S.SavedFilterName>{savedFilter.name}</S.SavedFilterName>
                <S.DeleteSavedFilter>
                  <i className="fas fa-times" />
                </S.DeleteSavedFilter>
              </S.SavedFilter>
            ))}
          </S.SavedFiltersContainer>
        </>
      ) : (
        <>
          <S.CreatedFilter>Create a new filter</S.CreatedFilter>
          <div>
            <InputLabel>Display name</InputLabel>
            <Input inputSize="M" placeholder="Enter Name" autoComplete="off" />
          </div>
          <div>
            <InputLabel>Filter code</InputLabel>
            <Textarea />
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
        </>
      )}
      <S.FilterButtonWrapper>
        <S.CancelButton onClick={toggleIsOpen}>Cancel</S.CancelButton>
        <S.AddButton>Add filter</S.AddButton>
      </S.FilterButtonWrapper>
    </S.MessageFilterModal>
  );
};

export default AddFilterModal;

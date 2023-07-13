import { PropTypes } from 'prop-types';
import { Box, Chip } from '@mui/material';
function TagsCell(props) {
  const { tags, limit, clickHandler, viewOnly, ...others } = props;
  const displayedTags = tags.slice(0, limit);
  const remainingTags = tags.length - limit;
  return (
    <Box
      {...others}
      display="flex"
      flexWrap="wrap"
      width={1}
      style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {!displayedTags.length && !viewOnly ? (
        <Chip
          onClick={clickHandler}
          size="small"
          label={`Add tags...`}
          style={{
            margin: '0 4px 4px 0',
            whiteSpace: 'nowrap',
          }}
        />
      ) : null}
      {displayedTags.map((tag, index) => (
        <Chip
          onClick={() => {
            clickHandler(tag);
          }}
          size="small"
          key={index}
          label={tag}
          style={{
            margin: '0 4px 4px 0',
            whiteSpace: 'nowrap',
          }}
        />
      ))}
      {remainingTags > 0 && (
        <Chip
          onClick={clickHandler}
          size="small"
          label={`+${remainingTags} more...`}
          style={{
            margin: '0 4px 4px 0',
            whiteSpace: 'nowrap',
          }}
        />
      )}
    </Box>
  );
}
TagsCell.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  limit: PropTypes.number,
  others: PropTypes.array,
  clickHandler: PropTypes.func.isRequired,
  viewOnly: PropTypes.bool,
};
export default TagsCell;

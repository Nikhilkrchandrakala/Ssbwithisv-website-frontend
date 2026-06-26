function CustomButton({ text, onClick, disabled, type = "button", style = {} }) {
    return (
        <button
            type={type}
            style={{
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                ...style
            }}
            className="ctaButton"
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    );
}

export default CustomButton;
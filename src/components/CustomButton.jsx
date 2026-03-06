function CustomButton({ text, onClick, disabled, type = "button" }) {
    return (
        <button
            type={type}
            style={{
                zIndex: "9999999",
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
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
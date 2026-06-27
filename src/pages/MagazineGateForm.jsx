import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaRegUser, FaRegCalendarAlt } from 'react-icons/fa';
import { GiStarMedal } from 'react-icons/gi';
import '../style/MagazineGateForm.css';

// ─── Zoho Form 2 credentials (Magazine Download Gate) ───
const ZOHO_FORM_ID   = 'webform736128000000824346';
const ZOHO_FORM_NAME = 'WebToLeads736128000000824346';
const ZOHO_xnQsjsdp  = '720f9139cb02224d64cc5aeff73db9005f465ab2730e39da353431dcb1023430';
const ZOHO_xmIwtLD   = '65e6b28d5296b04427701a1d7ca42502817609b9ddfb9fb3f6e06ce37fe146c8d00d862d54130301661ddbc145eb18dc';
const ZOHO_ENDPOINT  = 'https://crm.zoho.in/crm/WebToLeadForm';

const BOARD_OPTIONS = [
    '1 AFSB', '2 AFSB', '3 AFSB', '4 AFSB', '5 AFSB',
    '33 SSB Bhopal (Navy)', 'NSB Vizag (Navy)', '12 SSB Bangalore (Navy)',
    'SSB (Kolkata) (Navy)', '31 | 32 SSB Selection Center North (Kapurthala)',
    '11 | 14 | 18 | 19 | 34 SSB Selection Center East Prayagraj',
    '20 | 21 | 22 SSB Bhopal', '17 | 24 SSB Bangalore',
    'Not allotted yet', 'Not known right now', 'CGSB (NOIDA)', 'NOT IN THIS LIST'
];

const ENTRY_OPTIONS = [
    '10+2 B. Tech. entry (Navy)', '10+2 TES', 'AFCAT',
    'Army Service entry (PCSL, SCO, ACC, AMC)', 'CDS',
    'Navy Service entry (CW, SD List)', 'NCC special entry', 'NDA',
    'SSC (JAG)', 'SSC (Tech) Army',
    'SSC Navy (Executive, Law, Pilot, Naval Air Operations, Engineering, Electrical, Logistics, Naval Armament, Education)',
    'Territorial Army', 'TGC'
];

const STEPS = [
    { label: 'Basic Info',  Icon: FaRegUser },
    { label: 'SSB Profile', Icon: GiStarMedal },
    { label: 'Schedule',    Icon: FaRegCalendarAlt },
];

function MagazineGateForm({ onSuccess }) {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [data, setData] = useState({
        firstName: '', lastName: '', email: '', phone: '', dob: '',
        aspirant: '-None-', serving: '-None-', vtx: '-None-',
        youtube: '-None-', podcast: '-None-', experience: '-None-',
        nextSsb: '', boards: [], entries: [], city: '', state: '',
    });
    const [errors, setErrors] = useState({});

    // Load Zoho analytics script
    useEffect(() => {
        const scriptId = 'mgf_wf_anal';
        if (!document.getElementById(scriptId)) {
            const s = document.createElement('script');
            s.id = scriptId;
            s.src = 'https://crm.zohopublic.in/crm/WebFormAnalyticsServeServlet?rid=6761ef2a5403a9215ee06fd3a91e7f4cf40211c957590bc232cce76d2bcf503ed03cafa8ef35c8aba7edd3bc471b3b45gid552c7037f982366c143556da5744cd14ede9148a77c9eb5c8f8d305912b98787gid388c38d650af4eac878806c83366c1ff12ab610d05c1d1d36b0a42e653d60173gid3a18cd896ad2e659c511803c5af0c5cba63e0e4a5cb6b69806f73a3685480d1e&tw=4a4293a302f61020f9576453bd894ee22143df02420ed7d73f43d1e0fdefaf49';
            s.async = true;
            document.body.appendChild(s);
        }
    }, []);

    const set = (field, value) => {
        setData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const toggleMulti = (field, val) => {
        setData(prev => {
            const list = prev[field] || [];
            return {
                ...prev,
                [field]: list.includes(val) ? list.filter(x => x !== val) : [...list, val],
            };
        });
    };

    const validateStep = (s) => {
        const e = {};
        if (s === 1) {
            if (!data.lastName.trim()) e.lastName = 'Last name is required';
            if (!data.email.trim()) e.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'Enter a valid email';
            if (!data.phone.trim()) e.phone = 'Phone is required';
            else if (data.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid 10+ digit number';
        }
        if (s === 2) {
            if (data.aspirant === '-None-') e.aspirant = 'This field is required';
            if (data.serving === '-None-') e.serving = 'This field is required';
        }
        return e;
    };

    const nextStep = () => {
        const e = validateStep(step);
        if (Object.keys(e).length) { setErrors(e); toast.error('Please fill required fields'); return; }
        setStep(s => s + 1);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const stepErrors = { ...validateStep(1), ...validateStep(2) };
        if (Object.keys(stepErrors).length) { setErrors(stepErrors); setStep(1); toast.error('Please fill all required fields'); return; }

        setSubmitting(true);

        // Set Zoho SalesIQ visitor info
        try {
            if (window.$zoho?.salesiq) {
                const name = `${data.firstName} ${data.lastName}`.trim();
                window.$zoho.salesiq.visitor.name(name);
                window.$zoho.salesiq.visitor.email(data.email.trim());
                const el = document.getElementById('LDTuvid_mgf');
                if (el) el.value = window.$zoho.salesiq.visitor.uniqueid() || '';
            }
        } catch (_) {}

        // Build FormData from the hidden Zoho form element
        const formEl = document.getElementById(ZOHO_FORM_ID + '_mgf');
        const body = new URLSearchParams(new FormData(formEl));

        try {
            const res = await fetch(ZOHO_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                body: body.toString(),
                cache: 'no-cache',
            });
            if (!res.ok) throw new Error('Submission failed');

            // Mark zoho form as filled
            try {
                const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                const apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://api.ssbwithisv.in';
                if (token) {
                    fetch(`${apiBase}/api/user/zoho-form-filled`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'token': token },
                    }).catch(() => {});
                }
                localStorage.setItem('zohoFormFilled', 'true');
            } catch (_) {}

            toast.success('Thank you! Starting your download...');
            if (onSuccess) onSuccess();

        } catch (err) {
            toast.error('Submission failed. Please try again.');
            console.error('[MagazineGateForm]', err);
        } finally {
            setSubmitting(false);
        }
    };

    const err = (field) => errors[field] ? (
        <span className="mgf-error">⚠ {errors[field]}</span>
    ) : null;

    return (
        <div className="mgf-wrapper">
            {/* Hidden Zoho native form (for FormData collection) */}
            <form id={`${ZOHO_FORM_ID}_mgf`} name={ZOHO_FORM_NAME} acceptCharset="UTF-8" style={{ display: 'none' }}>
                <input type="text" name="xnQsjsdp"  value={ZOHO_xnQsjsdp}  readOnly />
                <input type="hidden" name="zc_gad"  id="zc_gad_mgf" value="" />
                <input type="text" name="xmIwtLD"   value={ZOHO_xmIwtLD}   readOnly />
                <input type="text" name="actionType" value="TGVhZHM="       readOnly />
                <input type="text" name="returnURL"  value="null"           readOnly />
                <input type="text" id="ldeskuid_mgf" name="ldeskuid" value="" readOnly />
                <input type="text" id="LDTuvid_mgf"  name="LDTuvid"  value="" readOnly />
                <input type="text" name="First Name"    value={data.firstName}         readOnly />
                <input type="text" name="Last Name"     value={data.lastName}          readOnly />
                <input type="text" name="Email"         value={data.email}             readOnly />
                <input type="text" name="Phone"         value={data.phone}             readOnly />
                <input type="text" name="LEADCF53"      value={data.dob}               readOnly />
                <input type="text" name="LEADCF25"      value={data.aspirant}          readOnly />
                <input type="text" name="LEADCF1"       value={data.serving}           readOnly />
                <input type="text" name="LEADCF5"       value={data.vtx}               readOnly />
                <input type="text" name="LEADCF8"       value={data.youtube}           readOnly />
                <input type="text" name="LEADCF7"       value={data.podcast}           readOnly />
                <input type="text" name="LEADCF9"       value={data.experience}        readOnly />
                <input type="text" name="LEADCF51"      value={data.nextSsb}           readOnly />
                <input type="text" name="LEADCF17"      value={data.boards.join(';')}  readOnly />
                <input type="text" name="LEADCF15"      value={data.entries.join(';')} readOnly />
                <input type="text" name="City"          value={data.city}              readOnly />
                <input type="text" name="State"         value={data.state}             readOnly />
                <input type="text" name="Lead Source"   value="Magazine Downloads"     readOnly />
                <input type="text" name="aG9uZXlwb3Q"  value=""                       readOnly />
            </form>

            {/* Step Indicator */}
            <div className="mgf-steps">
                {STEPS.map((s, i) => (
                    <React.Fragment key={i}>
                        <div className={`mgf-step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
                            <div className="mgf-step-circle">
                                {step > i + 1
                                    ? <span style={{ fontSize: '16px', fontWeight: 800 }}>✓</span>
                                    : <s.Icon size={20} />
                                }
                            </div>
                            <span className="mgf-step-label">{s.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`mgf-step-line ${step > i + 1 ? 'done' : ''}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* ═══ STEP 1: Basic Info ═══ */}
            {step === 1 && (
                <div className="mgf-section">
                    <div className="mgf-section-header">
                        <div className="mgf-section-icon"><FaRegUser size={22} /></div>
                        <div>
                            <h3 className="mgf-section-title">Basic Information</h3>
                            <p className="mgf-section-sub">Let us know who you are</p>
                        </div>
                    </div>

                    <div className="mgf-row-2">
                        <div className="mgf-field">
                            <label className="mgf-label">First Name</label>
                            <input className="mgf-input" placeholder="Arjun" value={data.firstName}
                                onChange={e => set('firstName', e.target.value)} />
                        </div>
                        <div className="mgf-field">
                            <label className="mgf-label">Last Name <span className="mgf-required">*</span></label>
                            <input className={`mgf-input ${errors.lastName ? 'mgf-input-error' : ''}`}
                                placeholder="Sharma"
                                value={data.lastName}
                                onChange={e => set('lastName', e.target.value)} />
                            {err('lastName')}
                        </div>
                    </div>

                    <div className="mgf-field">
                        <label className="mgf-label">Email <span className="mgf-required">*</span></label>
                        <input className={`mgf-input ${errors.email ? 'mgf-input-error' : ''}`}
                            placeholder="arjun@email.com" type="email"
                            value={data.email}
                            onChange={e => set('email', e.target.value)} />
                        {err('email')}
                    </div>

                    <div className="mgf-row-2">
                        <div className="mgf-field">
                            <label className="mgf-label">Phone <span className="mgf-required">*</span></label>
                            <input className={`mgf-input ${errors.phone ? 'mgf-input-error' : ''}`}
                                placeholder="9876543210" inputMode="numeric"
                                value={data.phone}
                                onChange={e => { const v = e.target.value.replace(/\D/g,''); if (v.length <= 15) set('phone', v); }} />
                            {err('phone')}
                        </div>
                        <div className="mgf-field">
                            <label className="mgf-label">Date of Birth</label>
                            <input className="mgf-input" type="date"
                                value={data.dob}
                                onChange={e => set('dob', e.target.value)} />
                        </div>
                    </div>

                    <div className="mgf-row-2">
                        <div className="mgf-field">
                            <label className="mgf-label">City</label>
                            <input className="mgf-input" placeholder="New Delhi"
                                value={data.city} onChange={e => set('city', e.target.value)} />
                        </div>
                        <div className="mgf-field">
                            <label className="mgf-label">State</label>
                            <input className="mgf-input" placeholder="Delhi"
                                value={data.state} onChange={e => set('state', e.target.value)} />
                        </div>
                    </div>

                    <div className="mgf-actions">
                        <button className="mgf-btn-primary" onClick={nextStep}>
                            Next — SSB Profile →
                        </button>
                    </div>
                </div>
            )}

            {/* ═══ STEP 2: SSB Profile ═══ */}
            {step === 2 && (
                <div className="mgf-section">
                    <div className="mgf-section-header">
                        <div className="mgf-section-icon"><GiStarMedal size={26} /></div>
                        <div>
                            <h3 className="mgf-section-title">SSB Profile</h3>
                            <p className="mgf-section-sub">Tell us about your SSB journey</p>
                        </div>
                    </div>

                    <div className="mgf-row-2">
                        <div className="mgf-field">
                            <label className="mgf-label">Are you an SSB Aspirant? <span className="mgf-required">*</span></label>
                            <select className={`mgf-select ${errors.aspirant ? 'mgf-input-error' : ''}`}
                                value={data.aspirant} onChange={e => set('aspirant', e.target.value)}>
                                <option value="-None-">Select…</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            {err('aspirant')}
                        </div>
                        <div className="mgf-field">
                            <label className="mgf-label">Serving candidate? <span className="mgf-required">*</span></label>
                            <select className={`mgf-select ${errors.serving ? 'mgf-input-error' : ''}`}
                                value={data.serving} onChange={e => set('serving', e.target.value)}>
                                <option value="-None-">Select…</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            {err('serving')}
                        </div>
                    </div>

                    <div className="mgf-row-2">
                        <div className="mgf-field">
                            <label className="mgf-label">SSB Experience</label>
                            <select className="mgf-select" value={data.experience} onChange={e => set('experience', e.target.value)}>
                                <option value="-None-">Select…</option>
                                <option value="Fresher">Fresher</option>
                                <option value="Screen Out">Screen Out</option>
                                <option value="Conference Out">Conference Out</option>
                            </select>
                        </div>
                        <div className="mgf-field">
                            <label className="mgf-label">Heard about VTX™?</label>
                            <select className="mgf-select" value={data.vtx} onChange={e => set('vtx', e.target.value)}>
                                <option value="-None-">Select…</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>

                    <div className="mgf-row-2">
                        <div className="mgf-field">
                            <label className="mgf-label">Subscribed to YouTube?</label>
                            <select className="mgf-select" value={data.youtube} onChange={e => set('youtube', e.target.value)}>
                                <option value="-None-">Select…</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="mgf-field">
                            <label className="mgf-label">Subscribed to Podcast?</label>
                            <select className="mgf-select" value={data.podcast} onChange={e => set('podcast', e.target.value)}>
                                <option value="-None-">Select…</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>

                    <div className="mgf-actions mgf-actions-split">
                        <button className="mgf-btn-ghost" onClick={() => setStep(1)}>← Back</button>
                        <button className="mgf-btn-primary" onClick={nextStep}>Next — Schedule →</button>
                    </div>
                </div>
            )}

            {/* ═══ STEP 3: Schedule ═══ */}
            {step === 3 && (
                <div className="mgf-section">
                    <div className="mgf-section-header">
                        <div className="mgf-section-icon"><FaRegCalendarAlt size={22} /></div>
                        <div>
                            <h3 className="mgf-section-title">Your SSB Schedule</h3>
                            <p className="mgf-section-sub">Optional — helps us send you relevant content</p>
                        </div>
                    </div>

                    <div className="mgf-field">
                        <label className="mgf-label">Next SSB Date</label>
                        <input className="mgf-input" type="date"
                            value={data.nextSsb} onChange={e => set('nextSsb', e.target.value)} />
                    </div>

                    <div className="mgf-field">
                        <label className="mgf-label">SSB Board / Centre</label>
                        <div className="mgf-checkbox-grid">
                            {BOARD_OPTIONS.map(opt => (
                                <label key={opt} className="mgf-checkbox-item">
                                    <input type="checkbox"
                                        checked={data.boards.includes(opt)}
                                        onChange={() => toggleMulti('boards', opt)} />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mgf-field">
                        <label className="mgf-label">SSB Entry</label>
                        <div className="mgf-checkbox-grid">
                            {ENTRY_OPTIONS.map(opt => (
                                <label key={opt} className="mgf-checkbox-item">
                                    <input type="checkbox"
                                        checked={data.entries.includes(opt)}
                                        onChange={() => toggleMulti('entries', opt)} />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mgf-submit-note">
                        ✅ All done! Hit submit to unlock your free download instantly.
                    </div>

                    <div className="mgf-actions mgf-actions-split">
                        <button className="mgf-btn-ghost" onClick={() => setStep(2)}>← Back</button>
                        <button
                            className={`mgf-btn-submit ${submitting ? 'mgf-submitting' : ''}`}
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <><span className="mgf-spinner"></span> Submitting…</>
                            ) : (
                                <>📥 Submit & Download</>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MagazineGateForm;

import streamlit as st
from encryption_utils import handle_user_encryption
import os
import json
import altair as alt
import base64
import pandas as pd

DATA_DIR = "../test_data_dir"  # Adjust if needed
LOGIN_FILE = "user_login.json"  # File to persist login state

# Helper functions for file-based login persistence
# def save_login(phone):
#     with open(LOGIN_FILE, "w") as f:
#         json.dump({"phone": phone}, f)

# def load_login():
#     if os.path.exists(LOGIN_FILE):
#         with open(LOGIN_FILE) as f:
#             data = json.load(f)
#             return data.get("phone")
#     return None

##
##
mobile_to_email = {
    "6666666666": "rupesh.arora303@gmail.com",
    "2222222222": "arorarp@rknec.edu"
}


# def clear_login():
#     if os.path.exists(LOGIN_FILE):
#         os.remove(LOGIN_FILE)

# Helper to prettify type names
def prettify_type(type_str):
    if type_str.startswith('ASSET_TYPE_'):
        type_str = type_str.replace('ASSET_TYPE_', '')
    if type_str.startswith('LIABILITY_TYPE_'):
        type_str = type_str.replace('LIABILITY_TYPE_', '')
    return type_str.replace('_', ' ').title()

class FinAgentXApp:
    def __init__(self):
        st.set_page_config(page_title="FinAgentX", page_icon=":money_with_wings:", layout="wide")
        self.setup_sidebar_logo()
        # Try to restore login state from file if not in session_state
        # if "logged_in" not in st.session_state:
        #     phone = load_login()
        #     if phone and os.path.isdir(f"{DATA_DIR}/{phone}"):
        #         st.session_state["logged_in"] = True
        #         st.session_state["phone"] = phone
        #     else:
        #         st.session_state["logged_in"] = False

    def setup_sidebar_logo(self):
        st.sidebar.markdown("# :money_with_wings: FinAgentX")
    
    def login(self):
     st.sidebar.header("Welcome Fi Money user!")
     st.sidebar.write("Login using your registered mobile number (as found in our test system).")
     phone = st.sidebar.text_input("Enter your registered mobile number")
     if st.sidebar.button("Login"):
        if phone and os.path.isdir(f"{DATA_DIR}/{phone}"):
            email = mobile_to_email.get(phone)
            if email:
                encrypted_data, error, key = handle_user_encryption(phone, mobile_to_email,  DATA_DIR,return_key=True)
                if error:
                    st.sidebar.error(f"Encryption failed: {error}")
                    return
                else:
                    st.sidebar.success("Encryption key sent to your email. You can now access your data.")
                    st.session_state["pending_key"] = base64.b64encode(key).decode()  # Store the key for this session
                    st.session_state["logged_in"] = True
                    st.session_state["phone"] = phone
                    st.session_state["decrypted"] = False
                    st.rerun()
            else:
                st.sidebar.error("No email found for this number.")
                return

            st.session_state["logged_in"] = True
            st.session_state["phone"] = phone
            st.sidebar.success("Login successful!")
            st.rerun()
        else:
            st.sidebar.error("Invalid mobile number. Please try again with a registered number.")

    def sidebar_welcome(self):
     st.sidebar.header(f"Welcome, {st.session_state['phone']}!")
     st.sidebar.write("You are now logged in to FinAgentX. Start exploring your personal finance data!")
     if st.sidebar.button("Logout"):
        st.session_state["logged_in"] = False
        st.session_state.pop("phone", None)
        st.rerun()

    def require_decryption_key(self):
      st.sidebar.header("Enter Decryption Key")
      user_key = st.sidebar.text_input("Paste the key sent to your email", type="password")
      if st.sidebar.button("Unlock Data"):
        if user_key == st.session_state.get("pending_key"):
            st.session_state["decrypted"] = True
            st.sidebar.success("Key accepted! Data unlocked.")
            st.rerun()
        else:
            st.sidebar.error("Invalid key. Please check your email and try again.")
     
    # def login(self):
    #  st.sidebar.header("Welcome Fi Money user!")
    #  st.sidebar.write("Login using your registered mobile number (as found in our test system).")
    #  phone = st.sidebar.text_input("Enter your registered mobile number")
    #  if st.sidebar.button("Login"):
    #     if phone and os.path.isdir(f"{DATA_DIR}/{phone}"):
    #         email = mobile_to_email.get(phone)
    #         if email:
    #             encrypted_data, error = handle_user_encryption(phone, mobile_to_email, DATA_DIR)
    #             if error:
    #                 st.sidebar.error(f"Encryption failed: {error}")
    #                 return  # Stop login if encryption fails
    #             else:
    #                 st.sidebar.success("Encryption key sent to your email. You can now access your data.")
    #         else:
    #             st.sidebar.error("No email found for this number.")
    #             return  # Stop login if no email

    #         st.session_state["logged_in"] = True
    #         st.session_state["phone"] = phone
    #         save_login(phone)  # Persist login in file
    #         st.sidebar.success("Login successful!")
    #         st.rerun()
    #     else:
    #         st.sidebar.error("Invalid mobile number. Please try again with a registered number.") 

    # def login(self):
    #     st.sidebar.header("Welcome Fi Money user!")
    #     st.sidebar.write("Login using your registered mobile number (as found in our test system).")
    #     phone = st.sidebar.text_input("Enter your registered mobile number")
    #     if st.sidebar.button("Login"):
    #         if phone and os.path.isdir(f"{DATA_DIR}/{phone}"):
    #             st.session_state["logged_in"] = True
    #             st.session_state["phone"] = phone
    #             save_login(phone)  # Persist login in file
    #             st.sidebar.success("Login successful!")
    #             st.rerun()
    #         else:
    #             st.sidebar.error("Invalid mobile number. Please try again with a registered number.")



    def landing_page(self):
        # Hero section with a much lighter blue gradient for better contrast
        st.markdown(
            """
            <div style="background: linear-gradient(90deg, #e3f0ff 0%, #b6e0fe 100%); padding: 1rem 1rem; border-radius: 1rem; text-align: center;">
                <h1 style="color: #222; font-size: 3rem; margin-bottom: 0.5rem;">FinAgentX</h1>
                <h3 style="color: #444;">Your Personalized Finance Agent</h3>
                <p style="color: #333; font-size: 1.2rem;">AI that understands <b>your</b> financial life, not just general finance. Connect your real data, ask real questions, and get actionable, private, and intelligent insights.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

        st.markdown("## What can FinAgentX do for you?")
        col1, col2, col3 = st.columns(3)
        with col1:
            st.markdown("### :moneybag: Net Worth")
            st.write("See your true net worth.")
            st.markdown("### :credit_card: Debt")
            st.write("Optimise and manage your loans.")
        with col2:
            st.markdown("### :chart_with_upwards_trend: Mutual Funds")
            st.write("Spot trends and improve returns.")
            st.markdown("### :bar_chart: Stocks")
            st.write("Track and analyse your stocks.")
        with col3:
            st.markdown("### :bank: EPF")
            st.write("Monitor your provident fund.")
            st.markdown("### :page_facing_up: Credit Report")
            st.write("Boost and protect your credit score.")

        st.markdown(
            """
            <div style="margin-top:2rem; text-align:center;">
                <h4>FinAgentX: Your AI-powered, privacy-first financial partner.</h4>
            </div>
            """,
            unsafe_allow_html=True
        )

    # def sidebar_welcome(self):
    #     st.sidebar.header(f"Welcome, {st.session_state['phone']}!")
    #     st.sidebar.write("You are now logged in to FinAgentX. Start exploring your personal finance data!")
    #     if st.sidebar.button("Logout"):
    #         st.session_state["logged_in"] = False
    #         st.session_state.pop("phone", None)
    #         clear_login()  # Remove persisted login
    #         st.rerun()

    
    # def sidebar_welcome(self):
    #  st.sidebar.header(f"Welcome, {st.session_state['phone']}!")
    #  st.sidebar.write("You are now logged in to FinAgentX. Start exploring your personal finance data!")

    # # Encrypt Button
    #  if st.sidebar.button("🔐 Encrypt & Email My Data"):
    #     phone = st.session_state["phone"]
    #     email = mobile_to_email.get(phone)
    #     if email:
    #         encrypted_data, error = handle_user_encryption(phone, mobile_to_email, DATA_DIR)
    #         if error:
    #             st.sidebar.error(f"Encryption failed: {error}")
    #         else:
    #             st.sidebar.success("Data encrypted and key sent to your email.")
    #             with st.expander("🔍 View Encrypted Files"):
    #                 st.json(encrypted_data)
    #     else:
    #         st.sidebar.error("No email found for this number.")

    #  if st.sidebar.button("Logout"):
    #     st.session_state["logged_in"] = False
    #     st.session_state.pop("phone", None)
    #     clear_login()
    #     st.rerun()

    def show_net_worth(self):
        phone = st.session_state.get("phone")
        if not phone:
            st.warning("No user logged in.")
            return
        net_worth_path = os.path.join(DATA_DIR, phone, "fetch_net_worth.json")
        if not os.path.isfile(net_worth_path):
            st.error("Net worth data not found for this user.")
            return
        with open(net_worth_path) as f:
            data = json.load(f)
        nw = data.get("netWorthResponse", {})
        total = nw.get("totalNetWorthValue", {})
        assets = nw.get("assetValues", [])
        liabilities = nw.get("liabilityValues", [])
        st.subheader(":moneybag: Net Worth Summary")
        st.metric("Total Net Worth", f"{total.get('currencyCode', '')} {total.get('units', '')}")
        # Prepare dataframes
        asset_data = [
            {
                "Type": prettify_type(a.get("netWorthAttribute", "-")),
                "Value": float(a["value"].get("units", 0)),
                "Currency": a["value"].get("currencyCode", "")
            }
            for a in assets
        ]
        liability_data = [
            {
                "Type": prettify_type(l.get("netWorthAttribute", "-")),
                "Value": float(l["value"].get("units", 0)),
                "Currency": l["value"].get("currencyCode", "")
            }
            for l in liabilities
        ]
        asset_df = pd.DataFrame(asset_data)
        liability_df = pd.DataFrame(liability_data)
        # Layout: two columns for charts, using more width
        col1, col2 = st.columns([1, 1])
        with col1:
            st.markdown("<span style='font-size:1.1rem;font-weight:600;color:#1976d2;'>Assets</span>", unsafe_allow_html=True)
            if not asset_df.empty:
                pie = alt.Chart(asset_df).mark_arc(innerRadius=50).encode(
                    theta=alt.Theta(field="Value", type="quantitative"),
                    color=alt.Color(field="Type", type="nominal"),
                    tooltip=["Type", "Value", "Currency"]
                ).properties(
                    width=350,
                    height=350,
                    title="Asset Breakdown"
                )
                st.altair_chart(pie, use_container_width=True)
            else:
                st.info("No asset data available.")
        with col2:
            st.markdown("<span style='font-size:1.1rem;font-weight:600;color:#d32f2f;'>Liabilities</span>", unsafe_allow_html=True)
            if not liability_df.empty:
                pie = alt.Chart(liability_df).mark_arc(innerRadius=50).encode(
                    theta=alt.Theta(field="Value", type="quantitative"),
                    color=alt.Color(field="Type", type="nominal"),
                    tooltip=["Type", "Value", "Currency"]
                ).properties(
                    width=350,
                    height=350,
                    title="Liability Breakdown"
                )
                st.altair_chart(pie, use_container_width=True)
            else:
                st.info("No liability data available.")
        # Modern KPI boxes for asset and liability components at the top
        st.markdown("<div style='margin-bottom: 0.5rem;'></div>", unsafe_allow_html=True)
        if not asset_df.empty:
            st.markdown("<h5 style='margin-bottom:0.2rem;'>Asset Components</h5>", unsafe_allow_html=True)
            asset_kpi_cols = st.columns(len(asset_df), gap="small")
            for idx, row in asset_df.iterrows():
                with asset_kpi_cols[idx]:
                    st.markdown(f"""
                        <div style='background: #e3f0ff; border-radius: 0.7rem; padding: 0.7rem 0.3rem; margin-bottom: 0.2rem; box-shadow: 0 1px 4px #e3f0ff66;'>
                            <div style='font-size: 1rem; color: #1976d2; font-weight: 600;'>{row['Type']}</div>
                            <div style='font-size: 1.2rem; color: #222; font-weight: bold;'>{row['Currency']} {row['Value']:.2f}</div>
                        </div>
                    """, unsafe_allow_html=True)
        if not liability_df.empty:
            st.markdown("<h5 style='margin-bottom:0.2rem;'>Liability Components</h5>", unsafe_allow_html=True)
            liability_kpi_cols = st.columns(len(liability_df), gap="small")
            for idx, row in liability_df.iterrows():
                with liability_kpi_cols[idx]:
                    st.markdown(f"""
                        <div style='background: #ffe3e3; border-radius: 0.7rem; padding: 0.7rem 0.3rem; margin-bottom: 0.2rem; box-shadow: 0 1px 4px #ffe3e366;'>
                            <div style='font-size: 1rem; color: #d32f2f; font-weight: 600;'>{row['Type']}</div>
                            <div style='font-size: 1.2rem; color: #222; font-weight: bold;'>{row['Currency']} {row['Value']:.2f}</div>
                        </div>
                    """, unsafe_allow_html=True)
        st.markdown("<hr style='margin: 0.5rem 0;' />", unsafe_allow_html=True)

    

    def run(self):
     if "logged_in" not in st.session_state:
        st.session_state["logged_in"] = False
     if "phone" not in st.session_state:
        st.session_state["phone"] = None
     if "decrypted" not in st.session_state:
        st.session_state["decrypted"] = False

     if not st.session_state["logged_in"]:
        self.landing_page()
        self.login()
     elif not st.session_state["decrypted"]:
        self.require_decryption_key()
     else:
        self.sidebar_welcome()
        # ...rest of your code...
        st.markdown("""
                <style>
                .block-container { padding-top: 4.5rem !important; }
                .custom-navbar {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    background: #f5f6fa !important;
                    border-bottom: 1px solid #e0e0e0 !important;
                    z-index: 99999 !important;
                    display: flex !important;
                    justify-content: flex-start !important;
                    align-items: center !important;
                    height: 3.5rem !important;
                    padding-left: 2rem !important;
                    box-shadow: 0 2px 8px #e0e0e033 !important;
                }
                .custom-navbar a {
                    margin-right: 2rem;
                    font-size: 1.2rem;
                    color: #222;
                    text-decoration: none;
                    font-weight: 600;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    transition: background 0.2s;
                }
                .custom-navbar a.selected {
                    background: #e3f0ff;
                    color: #1976d2;
                }
                .main-content {
                    margin-top: 0rem;
                }
                </style>
                <div class="custom-navbar">
                    <a href="#" class="nav-home" id="nav-home">Home</a>
                    <a href="#" class="nav-invest" id="nav-invest">Invest</a>
                </div>
            """, unsafe_allow_html=True)
            # Navigation logic
        if "nav_page" not in st.session_state:
                st.session_state["nav_page"] = "Home"
        nav_clicked = st.query_params.get("nav", [None])[0]
            # Fallback for Streamlit: use buttons
        nav1, nav2 = st.columns([1, 1])
        with nav1:
                if st.button("Home", key="nav_home_btn"):
                    st.session_state["nav_page"] = "Home"
        with nav2:
                if st.button("Invest", key="nav_invest_btn"):
                    st.session_state["nav_page"] = "Invest"
            # Main content area
        st.markdown('<div class="main-content">', unsafe_allow_html=True)
        if st.session_state["nav_page"] == "Home":
                self.show_net_worth()
        elif st.session_state["nav_page"] == "Invest":
                st.subheader(":chart_with_upwards_trend: Invest")
                st.info("Investment features coming soon!")
        st.markdown('</div>', unsafe_allow_html=True)

# --- Run the app ---
if __name__ == "__main__":

    app = FinAgentXApp()
    app.run() 
<script setup lang="ts">
import CoinsIcon from '@/components/icons/CoinsIcon.vue';
import { notify } from '@/reactives/notify';
import { useWalletStore } from '@/stores/wallet';
import ProgressBox from '@/components/ProgressBox.vue';
import { onMounted, ref } from "vue";
import Contract from '@/scripts/contract';
import Converter from '@/scripts/converter';
import { type Revenue } from '@/types';

const revenue = ref<Revenue | null>(null);
const walletStore = useWalletStore();
const loading = ref<boolean>(true);
const claimingTfuel = ref<boolean>(false);
const claimingHurbe = ref<boolean>(false);

const getRatio = (a: any, b: any) => {
    if (Number(a) == 0) return 0;
    return Number((Number(a) / (Number(a) + Number(b))) * 100).toFixed(0);
};

const sum = (a: any, b: any) => {
    return Number(a) + Number(b);
};

const getRevenue = async (load: boolean = true) => {
    loading.value = load;
    revenue.value = await Contract.getStreamer(walletStore.address!);
    loading.value = false;
};

const claimTfuel = async () => {
    if (claimingTfuel.value) return;
    if (revenue.value?.totalUnClaimedTfuel == BigInt(0)) {
        return;
    }
    claimingTfuel.value = true;

    const txHash = await Contract.claimTfuel(revenue.value?.totalUnClaimedTfuel || BigInt(0));

    if (txHash) {
        notify.push({
            title: 'Successful: Revenue claimed',
            description: 'Transaction sent',
            category: 'success'
        });
    } else {
        notify.push({
            title: 'Error: Interracting with theta api',
            description: 'Please try again',
            category: 'error'
        });
    }
    claimingTfuel.value = false;

    getRevenue(false);
};

const claimHurbe = async () => {
    if (claimingHurbe.value) return;
    if (revenue.value?.totalUnClaimedHurbe == BigInt(0)) {
        return;
    }

    claimingHurbe.value = true;

    const txHash = await Contract.claimHurbe(revenue.value?.totalUnClaimedHurbe || BigInt(0));

    if (txHash) {
        notify.push({
            title: 'Successful: Revenue claimed',
            description: 'Transaction sent',
            category: 'success'
        });
    } else {
        notify.push({
            title: 'Error: Interracting with theta api',
            description: 'Please try again',
            category: 'error'
        });
    }
    claimingHurbe.value = false;

    getRevenue(false);
};

onMounted(() => {
    getRevenue();
});
</script>

<template>
    <div class="load_frame" v-if="loading">
        <ProgressBox />
    </div>

    <div class="revenue_container" v-if="!loading && revenue">
        <div class="revenue">
            <div class="revenue_title">
                <p>Total Videos & Streams Revenue</p>
                <h3>{{ sum(Converter.toMoney(Converter.fromWei(revenue.totalClaimedTfuel)),
                    Converter.fromWei(revenue.totalUnClaimedTfuel)) }} HBAR</h3>
            </div>
            <div class="revenue_amounts">
                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/hbar.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromWei(revenue.totalUnClaimedTfuel)) }}</span>
                                HBAR ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromWei(revenue.totalUnClaimedTfuel),
                                Converter.fromWei(revenue.totalClaimedTfuel))
                        }}% Unclaimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromWei(revenue.totalUnClaimedTfuel), Converter.fromWei(revenue.totalClaimedTfuel))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromWei(revenue.totalUnClaimedTfuel), Converter.fromWei(revenue.totalClaimedTfuel))}%;`">
                        </div>
                    </div>
                </div>

                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/hbar.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromWei(revenue.totalClaimedTfuel)) }}</span> HBAR
                                ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromWei(revenue.totalClaimedTfuel),
                                Converter.fromWei(revenue.totalUnClaimedTfuel))
                        }}% Claimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromWei(revenue.totalClaimedTfuel), Converter.fromWei(revenue.totalUnClaimedTfuel))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromWei(revenue.totalClaimedTfuel), Converter.fromWei(revenue.totalUnClaimedTfuel))}%;`">
                        </div>
                    </div>
                </div>
            </div>
            <div class="revenue_claim">
                <div class="revenue_claim_text">
                    <p>Unclaimed Revenue</p>
                    <div class="revenue_claim_balance">
                        <div class="revenue_claim_balance_images">
                            <img src="/images/hbar.png" alt="">
                            <img src="/images/hbar.png" alt="">
                        </div>
                        <p>~ $0,00</p>
                    </div>
                </div>

                <button class="revenue_claim_btn" @click="claimTfuel">
                    <CoinsIcon /> {{ claimingTfuel ? 'Claiming...' : 'Claim' }}
                </button>
            </div>
        </div>

        <div class="revenue">
            <div class="revenue_title">
                <p>Total Tips Revenue</p>
                <h3>{{ sum(Converter.toMoney(Converter.fromWei(revenue.totalClaimedHurbe)),
                    Converter.fromWei(revenue.totalUnClaimedHurbe)) }} THUBE</h3>
            </div>
            <div class="revenue_amounts">
                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/logo.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromWei(revenue.totalUnClaimedHurbe)) }}</span>
                                THUBE ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromWei(revenue.totalUnClaimedHurbe),
                                Converter.fromWei(revenue.totalClaimedHurbe))
                        }}% Unclaimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromWei(revenue.totalUnClaimedHurbe), Converter.fromWei(revenue.totalClaimedHurbe))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromWei(revenue.totalUnClaimedHurbe), Converter.fromWei(revenue.totalClaimedHurbe))}%;`">
                        </div>
                    </div>
                </div>

                <div class="revenue_amount">
                    <div class="revenue_amount_name">
                        <div class="revenue_amount_name_text">
                            <img src="/images/logo.png" alt="theta">
                            <p><span>{{ Converter.toMoney(Converter.fromWei(revenue.totalClaimedHurbe)) }}</span> THUBE
                                ~ $0,00</p>
                        </div>

                        <div class="revenue_amount_percent">{{
                            getRatio(Converter.fromWei(revenue.totalClaimedHurbe),
                                Converter.fromWei(revenue.totalUnClaimedHurbe)) }}% Claimed</div>
                    </div>
                    <div class="revenue_amount_progress">
                        <div class="revenue_amount_bar"
                            :style="`width: ${getRatio(Converter.fromWei(revenue.totalClaimedHurbe), Converter.fromWei(revenue.totalUnClaimedHurbe))}%;`">
                        </div>
                        <div class="revenue_amount_bar_dot"
                            :style="`left: ${getRatio(Converter.fromWei(revenue.totalClaimedHurbe), Converter.fromWei(revenue.totalUnClaimedHurbe))}%;`">
                        </div>
                    </div>
                </div>
            </div>
            <div class="revenue_claim">
                <div class="revenue_claim_text">
                    <p>Unclaimed Revenue</p>
                    <div class="revenue_claim_balance">
                        <div class="revenue_claim_balance_images">
                            <img src="/images/logo.png" alt="">
                            <img src="/images/logo.png" alt="">
                        </div>
                        <p>~ $0,00</p>
                    </div>
                </div>

                <button class="revenue_claim_btn" @click="claimHurbe">
                    <CoinsIcon /> {{ claimingHurbe ? 'Claiming...' : 'Claim' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.revenue_container {
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
}

.revenue {
    width: 482px;
    max-width: 100%;
    border-radius: 8px;
    background: var(--bg-dark);
    overflow: hidden;
}

.revenue_title {
    padding: 24px 30px;
    border-bottom: 2px solid var(--bg);
}

.revenue_title p {
    font-size: 12px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.revenue_title h3 {
    margin-top: 14px;
    font-size: 20px;
    line-height: 20px;
    font-weight: 600;
    color: var(--tx-normal);
}

.revenue_amount {
    padding: 24px 30px;
    border-bottom: 2px solid var(--bg);
}

.revenue_amount:first-child {
    border-bottom: 2px solid var(--bg);
}

.revenue_amount_name {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.revenue_amount_name img {
    width: 24px;
    height: 24px;
    border-radius: 8px;
    object-fit: cover;
}

.revenue_amount_name_text {
    display: flex;
    align-items: center;
    gap: 10px;
}

.revenue_amount_name_text p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.revenue_amount_name_text p span {
    color: var(--tx-normal);
}

.revenue_amount_percent {
    font-size: 12px;
    font-weight: 500;
    color: var(--tx-normal);
}

.revenue_amount_progress {
    margin-top: 16px;
    position: relative;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: var(--bg-darkest);
}

.revenue_amount_bar {
    height: 100%;
    border-radius: 2px;
    background: var(--primary-light);
}

.revenue_amount_bar_dot {
    width: 14px;
    height: 14px;
    border-radius: 5px;
    background: var(--primary-light);
    border: 4px solid var(--primary);
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
}

.revenue_claim {
    padding: 24px 30px;
    border-bottom: 2px solid var(--bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.revenue_claim_text>p {
    font-size: 12px;
    line-height: 12px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.revenue_claim_balance {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.revenue_claim_balance_images {
    display: flex;
    align-items: center;
}

.revenue_claim_balance_images img {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    object-fit: cover;
}

.revenue_claim_balance_images img:first-child {
    z-index: 1;
}

.revenue_claim_balance_images img:last-child {
    margin-left: -6px;
}

.revenue_claim_balance>p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.revenue_claim_btn {
    background: var(--primary-light);
    width: 113px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    gap: 10px;
    border: none;
    cursor: pointer;
    user-select: none;
}
</style>